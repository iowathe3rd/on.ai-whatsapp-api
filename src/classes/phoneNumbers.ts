import {RequesterResponseInterface} from '../types/requester';
import BaseAPI from './base';
import {HttpMethodsEnum, WabaEnpoints, WAConfigEnum} from '../types/enums';
import * as pn from '../types/phoneNumbers';
import {Logger} from "../services/logger.service";
import {PhoneNumber} from "../types/phoneNumbers";

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

    return this.client.sendRequest(
      this.commonMethod,
      endpoint,
      JSON.stringify(body),
    );
  }

  verifyCode(
    body: pn.VerifyCodeObject,
  ): Promise<RequesterResponseInterface<pn.PhoneNumbersResponseObject>> {
    const endpoint = 'verify_code';

    return this.client.sendRequest(
      this.commonMethod,
      endpoint,
      JSON.stringify(body),
    );
  }

  getPhoneNumbers(
  ): Promise<pn.PhoneNumber[]>{
    const endpoint = `${this.config[WAConfigEnum.BusinessAcctId]}/${WabaEnpoints.PHONE_NUMBERS}`
    this.logger.debug(endpoint)
    return this.client.sendRequest<PhoneNumber[]>(
        HttpMethodsEnum.Get,
        endpoint
    )
  }
}
