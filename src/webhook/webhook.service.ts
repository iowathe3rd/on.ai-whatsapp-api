import { Injectable } from '@nestjs/common';
import { WebhookObject } from 'src/types';

@Injectable()
export class WebhookService {
  proceed(webhookObject: WebhookObject): any {
    // Обработка вебхука
    console.log('Received webhook:', webhookObject);

    // Ваша логика обработки вебхука здесь
    return { status: 'success' };
  }
}
