import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post
} from '@nestjs/common';
import {MessagesService} from './messages.service';
import {SendMessageDto} from './dto/send-message.dto';
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
      this.logger.log(`Message sent successfully: ${JSON.stringify(message)}`);
      return message;
    } catch (error) {
      this.logger.error(`Error sending message: ${error}`, error.stack);
      // Customize the error response based on error type
      if (error instanceof HttpException) {
        throw error; // Re-throw the original HttpException
      } else {
        throw new InternalServerErrorException('An unexpected error occurred while sending the message');
      }
    }
  }
}
