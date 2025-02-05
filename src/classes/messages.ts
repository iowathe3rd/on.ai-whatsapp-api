import BaseAPI from './base';
import {ComponentTypesEnum, HttpMethodsEnum, MessageTypesEnum, WAConfigEnum,} from '../types/enums';
import {RequestData} from '../types/httpsClient';
import * as m from '../types/messages';
import {MessagesResponse} from '../types/messages';
import {Logger} from "../services/logger.service";

export default class MessagesAPI extends BaseAPI implements m.MessagesClass {
  private readonly commonMethod = HttpMethodsEnum.Post;
  private readonly commonEndpoint = 'messages';
  private readonly logger = new Logger(MessagesAPI.name)

  public bodyBuilder<T extends MessageTypesEnum, C extends ComponentTypesEnum>(
    type: T,
    payload:
      | m.AudioMediaObject
      | [m.ContactObject]
      | m.DocumentMediaObject
      | m.ImageMediaObject
      | m.InteractiveObject
      | m.LocationObject
      | m.MessageTemplateObject<C>
      | m.StickerMediaObject
      | m.TextObject
      | m.VideoMediaObject,
    toNumber: string,
    replyMessageId?: string,
  ): m.MessageRequestBody<T> {
    const body: m.MessageRequestBody<T> = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: `78${toNumber.slice(1)}`,
      type: type,
      [type]: payload,
    };
    console.log(body)
    if (replyMessageId) body['context'] = { message_id: replyMessageId };

    this.logger.debug(`Building body for message type: ${type}`);
    return body;
  }

  send(
    body: RequestData,
  ): Promise<m.MessagesResponse> {
    this.logger.debug(`Sending message with body: ${body}`);
    try {
      return this.client.sendRequest<MessagesResponse>(
          this.commonMethod,
          `${this.config[WAConfigEnum.PhoneNumberId]}/${this.commonEndpoint}`,
          body,
      );
    }catch (e) {
      this.logger.fatal(e);
      throw Error("Something went wrong while sending capi request, check logs");
    }
  }

  async text(
    body: m.TextObject,
    recipient: string,
    replyMessageId?: string,
  ): Promise<m.MessagesResponse> {
    this.logger.debug(`Preparing to send text message to: ${recipient}`);
    return this.send(
      JSON.stringify(
          this.bodyBuilder(
              MessageTypesEnum.Text,
              body,
              recipient.toString(),
              replyMessageId
          )
      ),
    );
  }

  async audio(
    body: m.AudioMediaObject,
    recipient: string,
    replyMessageId?: string,
  ): Promise<m.MessagesResponse> {
    this.logger.debug(`Preparing to send audio message to: ${recipient}`);
    return this.send(
      JSON.stringify(
        this.bodyBuilder(
          MessageTypesEnum.Audio,
          body,
          recipient.toString(),
          replyMessageId,
        ),
      ),
    );
  }

  async contacts(
    body: [m.ContactObject],
    recipient: string,
    replyMessageId?: string,
  ): Promise<m.MessagesResponse> {
    this.logger.debug(`Preparing to send contacts message to: ${recipient}`);
    return this.send(
      JSON.stringify(
        this.bodyBuilder(
          MessageTypesEnum.Contacts,
          body,
          recipient.toString(),
          replyMessageId,
        ),
      ),
    );
  }

  async document(
    body: m.DocumentMediaObject,
    recipient: string,
    replyMessageId?: string,
  ): Promise<m.MessagesResponse> {
    this.logger.debug(`Preparing to send document message to: ${recipient}`);
    return this.send(
      JSON.stringify(
        this.bodyBuilder(
          MessageTypesEnum.Document,
          body,
          recipient.toString(),
          replyMessageId,
        ),
      ),
    );
  }

  async image(
    body: m.ImageMediaObject,
    recipient: string,
    replyMessageId?: string,
  ): Promise<m.MessagesResponse> {
    this.logger.debug(`Preparing to send image message to: ${recipient}`);
    return this.send(
      JSON.stringify(
        this.bodyBuilder(
          MessageTypesEnum.Image,
          body,
          recipient.toString(),
          replyMessageId,
        ),
      ),
    );
  }

  async interactive(
    body: m.InteractiveObject,
    recipient: string,
    replyMessageId?: string,
  ): Promise<m.MessagesResponse> {
    this.logger.debug(`Preparing to send interactive message to: ${recipient}`);
    return this.send(
      JSON.stringify(
        this.bodyBuilder(
          MessageTypesEnum.Interactive,
          body,
          recipient.toString(),
          replyMessageId,
        ),
      ),
    );
  }

  async location(
    body: m.LocationObject,
    recipient: string,
    replyMessageId?: string,
  ): Promise<m.MessagesResponse> {
    this.logger.debug(`Preparing to send location message to: ${recipient}`);
    return this.send(
      JSON.stringify(
        this.bodyBuilder(
          MessageTypesEnum.Location,
          body,
          recipient.toString(),
          replyMessageId,
        ),
      ),
    );
  }

  async sticker(
    body: m.StickerMediaObject,
    recipient: string,
    replyMessageId?: string,
  ): Promise<m.MessagesResponse> {
    this.logger.debug(`Preparing to send sticker message to: ${recipient}`);
    return this.send(
      JSON.stringify(
        this.bodyBuilder(
          MessageTypesEnum.Sticker,
          body,
          recipient.toString(),
          replyMessageId,
        ),
      ),
    );
  }

  async template(
    body: m.MessageTemplateObject<ComponentTypesEnum>,
    recipient: string,
    replyMessageId?: string,
  ): Promise<m.MessagesResponse> {
    this.logger.debug(`Preparing to send template message to: ${recipient}`);
    return this.send(
      JSON.stringify(
        this.bodyBuilder(
          MessageTypesEnum.Template,
          body,
          recipient.toString(),
          replyMessageId,
        ),
      ),
    );
  }

  async video(
    body: m.VideoMediaObject,
    recipient: string,
    replyMessageId?: string,
  ): Promise<m.MessagesResponse> {
    this.logger.debug(`Preparing to send video message to: ${recipient}`);
    return this.send(
      JSON.stringify(
        this.bodyBuilder(
          MessageTypesEnum.Video,
          body,
          recipient.toString(),
          replyMessageId,
        ),
      ),
    );
  }

  async status(
    body: m.StatusObject,
  ): Promise<m.MessagesResponse> {
    this.logger.debug(`Preparing to send status message`);
    const mp: m.GeneralMessageBody = { messaging_product: 'whatsapp' };
    const bodyToSend: m.StatusRequestBody = Object.assign(mp, body);

    return this.send(JSON.stringify(bodyToSend));
  }
}
