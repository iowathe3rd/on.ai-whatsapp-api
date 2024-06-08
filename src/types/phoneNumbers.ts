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

export type PhoneNumber = {
  verified_name: string,
  display_phone_number: string,
  id: string,
  quality_rating: "GREEN" | "YELLOW" | "READ" | "NA",
  platform_type?: "CLOUD_API",
  throughput?: {
    level: "STANDARD"
  },
  webhook_configuration?: {
    application: string
  },
}

export declare class phoneNumbersClass extends BaseClass {
  requestCode(
    body: RequestCodeObject,
  ): Promise<RequesterResponseInterface<PhoneNumbersResponseObject>>;

  verifyCode(
    body: VerifyCodeObject,
  ): Promise<RequesterResponseInterface<PhoneNumbersResponseObject>>;
}
