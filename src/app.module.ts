import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookModule } from './webhook/webhook.module';
import { MessageService } from './message/message.service';
import { MediaService } from './media/media.service';

@Module({
  imports: [WebhookModule],
  controllers: [AppController],
  providers: [AppService, MessageService, MediaService],
})
export class AppModule {}
