import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import prisma from 'src/lib/db';
import { MessagesObject, WebhookObject } from 'src/types';
import { Contact, Direction, MessageType, Status } from '@prisma/client';
import { WebhookTypesEnum } from '../types/enums';

@Injectable()
export class WebhookService {
  async handleWebhook(dto: WebhookObject): Promise<void> {
    //i need a function that will handle the webhook object and save it to the database
    const { entry } = dto;
    for (const entryItem of entry) {
      const { changes } = entryItem;
      for (const change of changes) {
        const { field, value } = change;
        if (field === 'messages') {
          const {
            contacts,
            errors,
            messages,
            messaging_product,
            metadata,
            statuses,
          } = value;

          const to = metadata[0].phoneNumberId;
          if (messages.length > 0) {
            const message = messages[0];
            const messageContent = this.getMessageContent(message);
            const senderData = await prisma.contact.findFirst({
              where: {
                phoneNumber: message.from,
              },
            });
            if (!senderData) {
              await prisma.contact.create({
                data: {
                  phoneNumber: message.from,
                  name: contacts[0].profile.name,
                },
              });
            }
            const contactId = await prisma.contact.findFirst({
              where: {
                phoneNumber: message.from,
              },
            });
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
                    id: contactId.id,
                  },
                },
              },
            });
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

    if (mode && token && challenge && mode === 'subscribe') {
      const isValid = token === process.env.WEBHOOK_VERIFY_TOKEN;
      if (isValid) {
        return challenge;
      } else {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
    } else {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  getMessageContent = (message: MessagesObject) => {
    return message[message.type];
  };
}
