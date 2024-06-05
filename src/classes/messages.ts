import { RequesterResponseInterface } from '../types/requester';
import BaseAPI from './base';
import {
  ComponentTypesEnum,
  HttpMethodsEnum,
  MessageTypesEnum,
  WAConfigEnum,
} from '../types/enums';
import { RequestData } from '../types/httpsClient';
import * as m from '../types/messages';
import axios from 'axios';
import { Logger } from 'src/logger/logger.service';

export default class MessagesAPI extends BaseAPI implements m.MessagesClass {
  private readonly commonMethod = HttpMethodsEnum.Post;
  private readonly commonEndpoint = 'messages';

  bodyBuilder<T extends MessageTypesEnum, C extends ComponentTypesEnum>(
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
      to: toNumber,
      type: type,
      [type]: payload,
    };

    if (replyMessageId) body['context'] = { message_id: replyMessageId };

    this.logger.debug(`Building body for message type: ${type}`);
    return body;
  }

  send(
    body: RequestData,
  ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
    this.logger.debug(`Sending message with body: ${body}`);
    return this.client.sendCAPIRequest(
      this.commonMethod,
      this.commonEndpoint,
      this.config[WAConfigEnum.RequestTimeout],
      body,
    );
  }

  async text(
    body: m.TextObject,
    recipient: string,
    replyMessageId?: string,
  ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
    this.logger.debug(`Preparing to send text message to: ${recipient}`);
    const requestBody = this.bodyBuilder(
      MessageTypesEnum.Text,
      body,
      recipient,
      replyMessageId,
    );

    const sent = await axios.post(
      `https://graph.facebook.com/v20.0/335929729601931/messages`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer EAAbWpxpqRFwBOy2Ou5XECMxvKg9iD3X2rI5i8Q7GeVLekjJym1pOUC3JXL1HR0C08TMWpocbZA96nSbI0fDg0sv2RIVfMAg748Ute0MtMA6ZCGHZAVZCM97u2ZA6Da7O6fJMtTFjpSZC31QOZA5ZBOOG18ulaD63I18mxPV23GiqpQtuuC08SshZBE6KGI6JldjZCw5PuMlggI3DNDKQ9ZCFont4zOqZCEd1`,
        },
      },
    );

    new Logger().log(sent.data);

    return this.send(
      JSON.stringify(
        this.bodyBuilder(
          MessageTypesEnum.Text,
          body,
          recipient.toString(),
          replyMessageId,
        ),
      ),
    );
  }

  async audio(
    body: m.AudioMediaObject,
    recipient: string,
    replyMessageId?: string,
  ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
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
  ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
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
  ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
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
  ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
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
  ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
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
  ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
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
  ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
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
  ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
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
  ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
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
  ): Promise<RequesterResponseInterface<m.MessagesResponse>> {
    this.logger.debug(`Preparing to send status message`);
    const mp: m.GeneralMessageBody = { messaging_product: 'whatsapp' };
    const bodyToSend: m.StatusRequestBody = Object.assign(mp, body);

    return this.send(JSON.stringify(bodyToSend));
  }
}
