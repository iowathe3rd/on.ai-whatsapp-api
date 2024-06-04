import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import prisma from 'src/lib/db';
import { MessagesObject, WebhookObject } from 'src/types';
import { Contact, Direction, MessageType, Status } from '@prisma/client';
import WhatsApp from 'src/classes/Whatsapp';
import { Request } from 'express';
import { Logger, PinoLogger } from 'nestjs-pino';

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
        const { field, value } = change;

        // Проверяем, что поле изменения соответствует поле "messages"
        if (field === 'messages') {
          const { messages } = value;
          LOGGER.info('Processing messages:', messages);

          for (const message of messages) {
            LOGGER.info('Processing message:', message);

            // Получаем содержимое сообщения
            // Находим отправителя в базе данных или создаем нового
            const senderData = await this.findOrCreateSender(
              message.from,
              value.contacts[0].profile.name,
            );
            LOGGER.info('Sender data:', senderData);

            // Создаем новое сообщение в базе данных
            await this.createMessage(message, senderData.id);
            LOGGER.info('Message saved to database');

            await this.waba.messages.text(
              {
                body: 'HI!',
              },
              parseInt(senderData.phoneNumber),
            );
            LOGGER.info('Sent response message to:', senderData.phoneNumber);
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
    phoneNumber: string,
    name: string,
  ): Promise<Contact> {
    LOGGER.info('Finding or creating sender with phone number:', phoneNumber);

    let senderData = await prisma.contact.findFirst({
      where: {
        phoneNumber,
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
