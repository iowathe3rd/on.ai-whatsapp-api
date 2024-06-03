import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import prisma from 'src/lib/db';
import {MessagesObject, WebhookObject} from 'src/types';
import {Contact, Direction, MessageType, Status} from "@prisma/client";
import {WebhookTypesEnum} from "../types/enums";
import {timestamp} from "rxjs";

@Injectable()
export class WebhookService {
  async handleWebhook(dto: WebhookObject): Promise<void> {
    for (const entry of dto.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages') {
          const { contacts, messages } = change.value;

          for (const contact of contacts) {
            try {
              await prisma.contact.upsert({
                where: { phoneNumber: contact.wa_id }, // Using phoneNumber as unique identifier
                update: {
                  name: contact.profile.name,
                  updatedAt: new Date(), // Ensure updatedAt is set on update
                },
                create: {
                  name: contact.profile.name,
                  phoneNumber: contact.wa_id, // Assuming wa_id is a phone number
                },
              });
            } catch (error) {
              console.error('Error processing contact:', error);
              // Additional error handling, e.g., logging or notifications
            }
          }

          for (const contact of contacts) {
            try {
              await prisma.contact.upsert({
                where: { phoneNumber: contact.wa_id }, // Using phoneNumber as unique identifier
                update: {
                  name: contact.profile.name,
                  updatedAt: new Date(), // Ensure updatedAt is set on update
                },
                create: {
                  name: contact.profile.name,
                  phoneNumber: contact.wa_id, // Assuming wa_id is a phone number
                },
              });
            } catch (error) {
              console.error('Error processing contact:', error);
              // Additional error handling, e.g., logging or notifications
            }
          }

          for (const message of messages) {
            try {
              await prisma.message.create({
                data: {
                  wa_id: message.id,
                  timeStamp: new Date(Number(message.timestamp) * 1000),// Convert to ISO-8601 format
                  type: message.type.toUpperCase() as MessageType,
                  content: message[message.type],
                  direction: Direction.Inbound,
                  contact: {
                    connectOrCreate: {
                      where: {
                        phoneNumber: message.from,
                      },
                      create: {
                        name: contacts.find(contact => contact.wa_id === message.from)?.profile.name || '',
                        phoneNumber: message.from,
                      }
                    },
                  },
                  context: {
                    create: {
                      status: Status.Sent,
                    }
                  }
                },
              });
            } catch (error) {
              console.error('Error processing message:', error);
              // Additional error handling, e.g., logging or notifications
            }
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
    return message[message.type]
  };
}
