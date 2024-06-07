import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Request } from 'express';
import { WebhookObject } from 'src/types';
import { Logger } from 'src/services/logger.service';

@Controller('webhook')
export class WebhookController {
  private readonly logger: Logger;
  constructor(private readonly webhookService: WebhookService) {
    this.logger = new Logger(WebhookController.name);
  }
  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() requestBody: WebhookObject) {
    this.logger.log('Received webhook');
    return this.webhookService.handleWebhook(requestBody);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async verifyWebhook(@Req() req: Request) {
    this.logger.log('Received webhook verification request');
    return this.webhookService.verifyWebhook(req);
  }
}
