import { Injectable } from '@nestjs/common';
import {
  AudioObject,
  ButtonObject,
  ErrorObject,
  ImageObject,
  InteractiveObject,
  Order_Object,
  StickerObject,
  SystemObject,
  TextObject,
  VideoObject,
} from 'src/types';
import { WebhookTypesEnum } from 'src/types/enums';

type NewMessageDto = {
  from: string;
  timeStamp: Date;
  type: WebhookTypesEnum;
  content:
    | TextObject
    | AudioObject
    | ImageObject
    | StickerObject
    | VideoObject
    | InteractiveObject
    | Order_Object
    | Document
    | ErrorObject
    | SystemObject
    | ButtonObject;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read';
  readAt: Date;
};

@Injectable()
export class MessageService {
  async new(dto: NewMessageDto) {}
}
