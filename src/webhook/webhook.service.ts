import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import prisma from 'src/lib/db';
import { MessagesObject, WebhookObject } from 'src/types';
import { Contact, Direction, MessageType, Status } from '@prisma/client';
import WhatsApp from 'src/classes/Whatsapp';
import { Request } from 'express';
import { Logger, PinoLogger } from 'nestjs-pino';
import { LanguagesEnum } from 'src/types/enums';

const LOGGER = new PinoLogger({
  renameContext: 'WABA API CLIENT',
});

@Injectable()
export class WebhookService {
  private readonly waba: WhatsApp;
  constructor() {
    this.waba = new WhatsApp(parseInt(process.env.WA_PHONE_NUMBER_ID));
  }

  async handleWebhook(dto: WebhookObject): Promise<void> {
    LOGGER.info('Received webhook:', dto);

    // Деструктуризация объекта webhook
    const { entry } = dto;

    for (const entryItem of entry) {
      const { changes } = entryItem;

      for (const change of changes) {
        if (change.field === 'messages') {
          const { value } = change;
          const { messages } = value;

          for (const message of messages) {
            LOGGER.info('Processing message:', message);
            LOGGER.debug('MESSAGE FROM', message.from);

            const senderData = await this.findOrCreateSender(
              message.from,
              value.contacts[0].profile.name,
            );
            LOGGER.info('Sender data:', senderData);

            await this.createMessage(message, senderData.id);
            LOGGER.info('Message saved to database');

            await this.waba.messages
              .sticker(
                {
                  id: '798882015472548',
                },
                parseInt(message.from),
              )
              .then((res) => {
                LOGGER.debug('MESSAGE SENT');
              });
          }
        }
      }
    }
  }

  verifyWebhook(req: Request): string {
    LOGGER.info('Verifying webhook with request:', req);

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
      LOGGER.info('Webhook verified successfully');

      return challenge;
    } else {
      LOGGER.info('Webhook verification failed');

      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  getMessageContent(message: MessagesObject) {
    LOGGER.info('Getting message content for message:', message);

    return message[message.type];
  }

  // Функция для поиска или создания отправителя в базе данных
  private async findOrCreateSender(
    //Recipient phone number
    phoneNumber: string,
    //Recipient name
    name: string,
  ): Promise<Contact> {
    LOGGER.info('Finding or creating sender with phone number:', phoneNumber);

    let senderData = await prisma.contact.findFirst({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!senderData) {
      LOGGER.info('Sender not found, creating new sender');

      senderData = await prisma.contact.create({
        data: {
          phoneNumber,
          name,
        },
      });
    }

    LOGGER.info('Sender found:', senderData);

    return senderData;
  }

  // Функция для создания нового сообщения в базе данных
  private async createMessage(
    message: MessagesObject,
    senderId: string,
  ): Promise<void> {
    LOGGER.info('Creating message in database with content:', message);

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
    LOGGER.info('Message created in database successfully');
  }
}
