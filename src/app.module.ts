import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookModule } from './modules/webhook/webhook.module';
import { Logger } from './services/logger.service';
import { MessagesModule } from './modules/messages/messages.module';
import {ContactsModule} from "./modules/contacts/contacts.module";

@Module({
  imports: [WebhookModule, MessagesModule, ContactsModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
