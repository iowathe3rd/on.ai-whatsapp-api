import { RequesterResponseInterface } from '../types/requester';
import BaseAPI from './base';
import { HttpMethodsEnum, WAConfigEnum } from '../types/enums';
import * as tsv from 'src/types/twoStepVerification';
import Logger from 'src/utils/logger';

const LIB_NAME = 'TWOSTEPVERIFICATION_API';
const LOG_LOCAL = false;
const LOGGER = new Logger(LIB_NAME, process.env.DEBUG === 'true' || LOG_LOCAL);

export default class TwoStepVerificationAPI
  extends BaseAPI
  implements tsv.TwoStepVerificationClass
{
  private readonly commonMethod = HttpMethodsEnum.Post;
  private readonly commonEndpoint = '';

  setPin(
    pin: number,
  ): Promise<RequesterResponseInterface<tsv.SetPinResponseObject>> {
    const body: tsv.TwoStepVerificationObject = { pin: pin.toString() };
    LOGGER.log(
      `Setting two-step verification pin for phone number Id ${
        this.config[WAConfigEnum.PhoneNumberId]
      }`,
    );

    return this.client.sendCAPIRequest(
      this.commonMethod,
      this.commonEndpoint,
      this.config[WAConfigEnum.RequestTimeout],
      JSON.stringify(body),
    );
  }
}
