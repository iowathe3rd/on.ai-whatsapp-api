import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookModule } from './webhook/webhook.module';
import { Logger } from './logger/logger.service';

@Module({
  imports: [WebhookModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
