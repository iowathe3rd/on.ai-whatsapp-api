import {
  RequestHeaders,
  HttpsClientResponseClass,
  ResponseJSONBody,
} from './httpsClient';
import { HttpMethodsEnum } from './enums';

export type GeneralRequestBody = Record<string, any>;

export interface GeneralHeaderInterface extends RequestHeaders {
  /**
   * Authorization token. This is required for all HTTP requests made to the graph API.
   * @default 'Bearer '
   */
  Authorization: string;

  /**
   * Content type of the message being sent. This is required for all HTTP requests made to the graph API.
   * @default 'application/json'
   */
  'Content-Type': string;
}

export interface RequesterResponseInterface<T extends ResponseJSONBody>
  extends HttpsClientResponseClass {
  responseBodyToJSON: () => Promise<T>;
}

export declare class RequesterClass {
  constructor(
    host: string,
    apiVersion: string,
    phoneNumberId: number,
    accessToken: string,
  );
  sendRequest: <T>(
    method: HttpMethodsEnum,
    path: string,
    body?: any,
  ) => Promise<T>;
}
