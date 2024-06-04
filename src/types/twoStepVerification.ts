import { BaseClass } from './base';
import { RequesterResponseInterface } from './requester';

export type TwoStepVerificationObject = {
  pin: string;
};

export type SetPinResponseObject = {
  success: boolean;
};

export declare class TwoStepVerificationClass extends BaseClass {
  setPin(
    pin: number,
  ): Promise<RequesterResponseInterface<SetPinResponseObject>>;
}
