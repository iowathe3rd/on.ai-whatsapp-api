import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookModule } from './webhook/webhook.module';
import { MediaService } from './media/media.service';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [WebhookModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService, MediaService],
})
export class AppModule {}
