import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import prisma from 'src/lib/db';
import { MessagesObject, WebhookObject } from 'src/types';
import { Contact, Direction, MessageType, Status } from '@prisma/client';
import WhatsApp from 'src/classes/Whatsapp';
import { Request } from 'express';
import { Logger } from 'src/logger/logger.service';

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
          const { value } = change;
          const { messages } = value;

          for (const message of messages) {
            const senderData = await this.findOrCreateSender(
              message.from,
              value.contacts[0].profile.name,
            );

            this.logger.debug(JSON.stringify(senderData));
            await this.createMessage(message, senderData.id);

            await this.waba.messages.text(
              {
                body: 'Hello!',
              },
              senderData.phoneNumber,
            );
          }
        }
      }
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

  getMessageContent(message: MessagesObject) {
    return message[message.type];
  }

  // Функция для поиска или создания отправителя в базе данных
  private async findOrCreateSender(
    //Recipient phone number
    phoneNumber: string,
    //Recipient name
    name: string,
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
          name,
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
    const messageContent = this.getMessageContent(message);
    await prisma.message.create({
      data: {
        content: messageContent,
        type: message.type as MessageType,
        direction: Direction.inbound,
        timeStamp: new Date(),
        wa_id: message.id,
        context: {
          create: {
            status: Status.sent,
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
