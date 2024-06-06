import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {Logger} from "../../services/logger.service";
import {Message} from "@prisma/client";

@Controller('messages')
export class MessagesController {
  private readonly logger = new Logger(MessagesController.name);

  constructor(private readonly messagesService: MessagesService) {}

  @Post('send')
  @HttpCode(HttpStatus.CREATED)
  async send(@Body() sendMessageDto: SendMessageDto): Promise<Message> {
    try {
      const message = await this.messagesService.send(sendMessageDto);
      this.logger.log(`Message sent with ID: ${message.id}`);
      return message;
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      throw error;
    }
  }
}
