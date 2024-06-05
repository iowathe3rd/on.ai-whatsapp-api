import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import prisma from 'src/lib/db';
import { ErrorObject, MessagesObject, WebhookObject } from 'src/types';
import { Contact, Direction, MessageType, Status } from '@prisma/client';
import WhatsApp from 'src/classes/Whatsapp';
import { Request } from 'express';
import { Logger } from 'src/logger/logger.service';
import { StatusesObject } from 'src/types/webhook';

@Injectable()
export class WebhookService {
  private readonly waba: WhatsApp;
  private readonly logger: Logger;
  constructor() {
    this.waba = new WhatsApp(parseInt(process.env.WA_PHONE_NUMBER_ID));
    this.logger = new Logger('WEBHOOK SERVICE');
  }

  async handleWebhook(dto: WebhookObject): Promise<void> {
    // Деструктуризация объекта webhook
    const { entry } = dto;

    for (const entryItem of entry) {
      const { changes } = entryItem;

      for (const change of changes) {
        if (change.field === 'messages') {
          const { messages, statuses, errors } = change.value;
          if (Array.isArray(messages) && messages.length > 0) {
            await this.proceedMessageEvent(messages);
          }
          if (Array.isArray(statuses) && statuses.length > 0) {
            await this.proceedStatusesEvent(statuses);
          }
          if (Array.isArray(errors) && errors.length > 0) {
            await this.proceedErrorsEvent(errors);
          }
        }
      }
    }
  }

  async proceedMessageEvent(messages: MessagesObject[]) {
    for (const message of messages) {
      const senderData = await this.findOrCreateSender(message.from);
      this.logger.debug(JSON.stringify(senderData));
      await this.createMessage(message, senderData.id);
    }
  }

  async proceedErrorsEvent(errors: ErrorObject[]) {
    for (const error of errors) {
      this.logger.fatal(JSON.stringify(error));
    }
  }

  async proceedStatusesEvent(statuses: StatusesObject[]) {
    this.logger.debug(JSON.stringify(statuses));
    for (const status of statuses) {
      const { id, status: messageStatus } = status;
      await prisma.message.update({
        where: {
          wa_id: id,
        },
        data: {
          context: {
            update: {
              status: messageStatus as Status,
            },
          },
        },
      });
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
    this.logger.debug(JSON.stringify(message));
    const messageContent = message[message.type];
    await prisma.message.create({
      data: {
        content: messageContent,
        type: message.type as MessageType,
        direction: Direction.inbound,
        timeStamp: new Date(),
        wa_id: message.id,
        context: {
          create: {
            status: Status.read,
          },
        },
        contact: {
          connect: {
            id: senderId,
          },
        },
      },
    });
  }
}
