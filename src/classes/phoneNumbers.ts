import { RequesterResponseInterface } from '../types/requester';
import BaseAPI from './base';
import { HttpMethodsEnum, WAConfigEnum } from '../types/enums';
import * as pn from '../types/phoneNumbers';
import {Logger} from "../services/logger.service";

export default class PhoneNumbersAPI
  extends BaseAPI
  implements pn.phoneNumbersClass
{
  private readonly commonMethod = HttpMethodsEnum.Post;

  private readonly logger = new Logger(PhoneNumbersAPI.name)
  requestCode(
    body: pn.RequestCodeObject,
  ): Promise<RequesterResponseInterface<pn.PhoneNumbersResponseObject>> {
    const endpoint = 'request_code';

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

    return this.client.sendCAPIRequest(
      this.commonMethod,
      endpoint,
      this.config[WAConfigEnum.RequestTimeout],
      JSON.stringify(body),
    );
  }
}
