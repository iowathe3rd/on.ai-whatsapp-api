import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import prisma from 'src/lib/db';
import { WebhookObject } from 'src/types';

@Injectable()
export class WebhookService {
  async handleWebhook(dto: WebhookObject): Promise<void> {
    for (const entry of dto.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages') {
          const { contacts, messages } = change.value;

          for (const contact of contacts) {
            const candidate = await prisma.contact.create({
              data: {
                wa_id: contact.wa_id,
                firstName: contact.profile.name,
              },
            });
          }

          for (const message of messages) {
            await prisma.message.create({
              data: {
                from: message.from,
                timeStamp: new Date(Number(message.timestamp) * 1000),
                type: message.type,
                content: message,
                chatId: chatId,
                direction: 'Client', // Assuming all incoming messages are from the client
                status: 'Sent', // Initial status
              },
            });

            if (message.type === 'image') {
              // Handle image download if needed
              await downloadMedia(message);
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
}
