import { RequesterResponseInterface } from '../types/requester';
import BaseAPI from './base';
import { HttpMethodsEnum, WAConfigEnum } from '../types/enums';
import * as pn from '../types/phoneNumbers';
import { PinoLogger } from 'nestjs-pino';

const LOGGER = new PinoLogger({
  renameContext: 'WABA API CLIENT(phone numbers)',
});
export default class PhoneNumbersAPI
  extends BaseAPI
  implements pn.phoneNumbersClass
{
  private readonly commonMethod = HttpMethodsEnum.Post;

  requestCode(
    body: pn.RequestCodeObject,
  ): Promise<RequesterResponseInterface<pn.PhoneNumbersResponseObject>> {
    const endpoint = 'request_code';
    LOGGER.info(
      `Requesting phone number verification code for phone number Id ${
        this.config[WAConfigEnum.PhoneNumberId]
      }`,
    );

    return this.client.sendCAPIRequest(
      this.commonMethod,
      endpoint,
      this.config[WAConfigEnum.RequestTimeout],
      JSON.stringify(body),
    );
  }

  verifyCode(
    body: pn.VerifyCodeObject,
  ): Promise<RequesterResponseInterface<pn.PhoneNumbersResponseObject>> {
    const endpoint = 'verify_code';
    LOGGER.info(
      `Sending phone number verification code ${
        body.code
      } for phone number Id ${this.config[WAConfigEnum.PhoneNumberId]}`,
    );

    return this.client.sendCAPIRequest(
      this.commonMethod,
      endpoint,
      this.config[WAConfigEnum.RequestTimeout],
      JSON.stringify(body),
    );
  }
}
