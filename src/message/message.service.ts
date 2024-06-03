import { Injectable } from '@nestjs/common';
import {CreateMessageDto} from "./dto/Create-message.dto";
import {getMessageContent} from "../utils/message";
import {MessagesObject} from "../types";


@Injectable()
export class MessageService {
}
