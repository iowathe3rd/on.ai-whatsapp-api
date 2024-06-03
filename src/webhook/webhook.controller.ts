import { Body, Controller, Get, Post } from '@nestjs/common';
import { WebhookObject } from 'src/types';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  @Post()
  handleWebhook(@Body() body: WebhookObject) {
    return this.webhookService.proceed(body);
  }
}
