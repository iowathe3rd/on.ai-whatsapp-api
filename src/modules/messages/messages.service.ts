import {Injectable} from '@nestjs/common';
import {SendMessageDto} from './dto/send-message.dto';
import WhatsApp from "../../classes/Whatsapp";
import {MessageTypesEnum} from "../../types/enums";
import * as m from "../../types/messages";
import {Logger} from "../../services/logger.service";
import prisma from "../../lib/db";
import {Direction, Message, MessageType, Status} from "@prisma/client";

@Injectable()
export class MessagesService {
  private readonly waba: WhatsApp = new WhatsApp();
  private readonly logger: Logger = new Logger(MessagesService.name);
  async send(dto: SendMessageDto): Promise<Message> {
    const {type, to, content, context, reaction} = dto;
    const body: m.MessageRequestBody<MessageTypesEnum> = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: `78${dto.to.slice(1)}`,
      type: type,
      [type]: content,
    };

    if (context) body['context'] = { message_id: context.message_id };
    this.logger.debug(`Building body for message type: ${type}, to: ${to}, content: ${JSON.stringify(content)}, context: ${JSON.stringify(context)}`);

    try {
      this.logger.log(`Sending message to WhatsApp API: ${JSON.stringify(body)}`);
      const sent = await this.waba.messages.send(body);
      this.logger.debug(`Message sent via WhatsApp API: ${JSON.stringify(sent)}`);

      try {
        this.logger.log(`Saving message to database: ${JSON.stringify(sent.messages[0])}`);

        const saved = await prisma.message.create({
          data: {
            type: body.type as MessageType,
            content: content,
            context: {
              create: {
                status: Status.sent,
              },
            },
            wa_id: sent.messages[0].id,
            direction: Direction.outbound,
            contact: {
              connectOrCreate: {
                create: {
                  phoneNumber: sent.contacts[0].wa_id,
                },
                where: {
                  phoneNumber: sent.contacts[0].wa_id,
                },
              },
            },
            timeStamp: new Date(),
          },
        });
        this.logger.log(`Message saved to database with ID: ${saved.id}`);
        return saved;
      } catch (dbError) {
        this.logger.error(`Error saving message to database: ${dbError.message}`);
        throw new Error(`Database error: ${dbError.message}`);
      }
    }catch (apiError) {
      this.logger.error(`Error sending message via WhatsApp API: ${apiError.message}`);
      throw new Error(`WhatsApp API error: ${apiError.message}`);
    }
  }
}
