import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import prisma from 'src/lib/db';
import { MessagesObject, WebhookObject } from 'src/types';
import { Contact, Direction, MessageType, Status } from '@prisma/client';

@Injectable()
export class WebhookService {
  async handleWebhook(dto: WebhookObject): Promise<void> {
    // Деструктуризация объекта webhook
    const { entry } = dto;

    for (const entryItem of entry) {
      const { changes } = entryItem;

      for (const change of changes) {
        const { field, value } = change;

        // Проверяем, что поле изменения соответствует поле "messages"
        if (field === 'messages') {
          const { messages } = value;

          for (const message of messages) {
            // Получаем содержимое сообщения
            // Находим отправителя в базе данных или создаем нового
            const senderData = await this.findOrCreateSender(
              message.from,
              value.contacts[0].profile.name,
            );

            // Создаем новое сообщение в базе данных
            await this.createMessage(message, senderData.id);
          }
        }
      }
    }
  }

  verifyWebhook(req: Request): string {
    const urlDecoded = new URL(req.url);
    const urlParams = urlDecoded.searchParams;
    const mode = urlParams.get('hub.mode');
    const token = urlParams.get('hub.verify_token');
    const challenge = urlParams.get('hub.challenge');

    // Проверяем, что режим подписки и токен верификации соответствуют ожиданиям
    if (
      mode &&
      token &&
      challenge &&
      mode === 'subscribe' &&
      token === process.env.WEBHOOK_VERIFY_TOKEN
    ) {
      return challenge;
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  getMessageContent = (message: MessagesObject) => {
    return message[message.type];
  };

  // Функция для поиска или создания отправителя в базе данных
  private async findOrCreateSender(
    phoneNumber: string,
    name: string,
  ): Promise<Contact> {
    let senderData = await prisma.contact.findFirst({
      where: {
        phoneNumber,
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
        type: message.type.toUpperCase() as MessageType,
        direction: Direction.Inbound,
        timeStamp: new Date(),
        wa_id: message.id,
        context: {
          create: {
            status: Status.Sent,
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
