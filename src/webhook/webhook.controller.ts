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

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() requestBody: any) {
    return this.webhookService.handleWebhook(requestBody);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async verifyWebhook(@Req() req: Request) {
    return this.webhookService.verifyWebhook(req);
  }
}
