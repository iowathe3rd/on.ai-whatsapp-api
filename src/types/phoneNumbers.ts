import { BaseClass } from './base';
import { LanguagesEnum, RequestCodeMethodsEnum } from './enums';
import { RequesterResponseInterface } from './requester';

export type RequestCodeObject = {
  code_method: RequestCodeMethodsEnum;
  language: LanguagesEnum;
};

type VerifyCodeString = `${number}`;

export type VerifyCodeObject = {
  code: VerifyCodeString;
};

export type PhoneNumbersResponseObject = {
  success: boolean;
};

export declare class phoneNumbersClass extends BaseClass {
  requestCode(
    body: RequestCodeObject,
  ): Promise<RequesterResponseInterface<PhoneNumbersResponseObject>>;

  verifyCode(
    body: VerifyCodeObject,
  ): Promise<RequesterResponseInterface<PhoneNumbersResponseObject>>;
}
