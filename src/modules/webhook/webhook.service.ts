import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import prisma from 'src/lib/db';
import {ContactObject, ErrorObject, MessagesObject, WebhookObject} from 'src/types';
import { Contact, Direction, MessageType, Status } from '@prisma/client';
import WhatsApp from 'src/classes/Whatsapp';
import { Request } from 'express';
import { Logger } from 'src/services/logger.service';
import {StatusesObject, ValueObject} from 'src/types/webhook';
import {RuntimeException} from "@nestjs/core/errors/exceptions";

@Injectable()
export class WebhookService {
  private readonly waba: WhatsApp;
  private readonly logger: Logger;
  constructor() {
    this.waba = new WhatsApp(parseInt(process.env.WA_PHONE_NUMBER_ID));
    this.logger = new Logger(WebhookService.name);
  }

  async handleWebhook(dto: WebhookObject): Promise<void> {
    // Деструктуризация объекта webhook
    const { entry } = dto;

    for (const entryItem of entry) {
      const { changes } = entryItem;

      for (const change of changes) {
        if (change.field === 'messages') {
          const { messages, statuses, errors, contacts } = change.value;
          if (Array.isArray(messages) && messages.length > 0) {
            await this.proceedMessageEvent(messages[0], contacts[0]);
          }
          if (Array.isArray(statuses) && statuses.length > 0) {
            await this.proceedStatusesEvent(statuses[0]);
          }
          if (Array.isArray(errors) && errors.length > 0) {
            await this.proceedErrorsEvent(errors[0]);
          }
        }
      }
    }
  }

  async proceedMessageEvent(message: MessagesObject, contact: ContactObject) {
    let sender = await prisma.contact.findUnique({
      where: {
        phoneNumber: message.from
      }
    })

    if(!sender) {
      sender = await prisma.contact.create({
        data: {
          phoneNumber: message.from,
          name: contact.profile.name || "Unknown"
        }
      })
    }

    await this.createMessage(message, sender.id);
  }

  async proceedErrorsEvent(error: ErrorObject) {
    this.logger.fatal(JSON.stringify(error));
  }

  async proceedStatusesEvent(status: StatusesObject) {
    this.logger.debug(`Received status: ${JSON.stringify(status)}`);
    const { id, status: messageStatus } = status;

    try {
      const existingMessage = await prisma.message.findUnique({
        where: { wa_id: id },
      });

      if (!existingMessage) {
        this.logger.error(`No message found with wa_id: ${id}`);
        throw new NotFoundException(`Message with wa_id ${id} not found`);
      }

      await prisma.message.update({
        where: { wa_id: id },
        data: {
          context: {
            upsert: {
              create: { status: Status[messageStatus] },
              update: { status: Status[messageStatus] },
            },
          },
        },
      });
    }catch (e) {
      this.logger.fatal(String(e))
      throw new RuntimeException(e)
    }
  }



  verifyWebhook(req: Request): string {
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'] as string;
    // Проверяем, что режим подписки и токен верификации соответствуют ожиданиям
    if (
      mode &&
      token &&
      challenge &&
      token === process.env.WEBHOOK_VERIFY_TOKEN
    ) {
      return challenge;
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  // Функция для поиска или создания отправителя в базе данных
  private async findOrCreateSender(
    //Recipient phone number
    phoneNumber: string,
    //Recipient name
  ): Promise<Contact> {
    let senderData = await prisma.contact.findFirst({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!senderData) {
      senderData = await prisma.contact.create({
        data: {
          phoneNumber,
        },
      });
    }

    return senderData;
  }

  // Функция для создания нового сообщения в базе данных
  private async createMessage(
    message: MessagesObject,
    senderId: string,
  ): Promise<void> {
    const existingMessage = await prisma.message.findUnique({
      where: { wa_id: message.id },
    });

    this.logger.debug(JSON.stringify(message));
    if (!existingMessage) {
      const messageContent = message[message.type];

      await prisma.message.create({
        data: {
          content: messageContent,
          type: message.type as MessageType,
          direction: Direction.inbound,
          timeStamp: new Date(),
          wa_id: message.id,
          context: {
            create: { status: Status.read },
          },
          contact: {
            connect: { id: senderId },
          },
        },
      });
    }
  }
}
