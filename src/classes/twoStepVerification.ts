import { RequesterResponseInterface } from '../types/requester';
import BaseAPI from './base';
import { HttpMethodsEnum, WAConfigEnum } from '../types/enums';
import * as tsv from 'src/types/twoStepVerification';
import {Logger} from "../services/logger.service";
export default class TwoStepVerificationAPI
  extends BaseAPI
  implements tsv.TwoStepVerificationClass
{
  private readonly commonMethod = HttpMethodsEnum.Post;
  private readonly commonEndpoint = '';
  private readonly logger = new Logger(TwoStepVerificationAPI.name)

  setPin(
    pin: number,
  ): Promise<RequesterResponseInterface<tsv.SetPinResponseObject>> {
    const body: tsv.TwoStepVerificationObject = { pin: pin.toString() };
    return this.client.sendCAPIRequest(
      this.commonMethod,
      this.commonEndpoint,
      this.config[WAConfigEnum.RequestTimeout],
      JSON.stringify(body),
    );
  }
}
