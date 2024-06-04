import Logger from './logger';
import HttpsClient from './httpsClient';
import { HttpMethodsEnum } from 'src/types/enums';
import { RequesterClass, GeneralHeaderInterface } from 'src/types/requester';

const LIB_NAME = 'REQUESTER';
const LOG_LOCAL = false;
const LOGGER = new Logger(LIB_NAME, process.env.DEBUG === 'true' || LOG_LOCAL);

export default class Requester implements RequesterClass {
  client: Readonly<HttpsClient>;
  accessToken: Readonly<string>;
  phoneNumberId: Readonly<number>;
  businessAcctId: Readonly<string>;
  apiVersion: Readonly<string>;
  host: Readonly<string>;
  protocol: Readonly<string> = 'https:';
  port: Readonly<number> = 443;

  constructor(
    host: string,
    apiVersion: string,
    phoneNumberId: number,
    accessToken: string,
    businessAcctId: string,
  ) {
    this.client = new HttpsClient();
    this.host = host;
    this.apiVersion = apiVersion;
    this.phoneNumberId = phoneNumberId;
    this.accessToken = accessToken;
    this.businessAcctId = businessAcctId;
  }

  buildHeader(contentType: string): GeneralHeaderInterface {
    const headers: GeneralHeaderInterface = {
      'Content-Type': contentType,
      Authorization: `Bearer ${this.accessToken}`,
    };
    return headers;
  }

  buildCAPIPath(endpoint: string): string {
    return `/${this.apiVersion}/${this.phoneNumberId}/${endpoint}`;
  }

  async sendCAPIRequest(
    method: HttpMethodsEnum,
    endpoint: string,
    timeout: number,
    body?: any,
  ) {
    const contentType = 'application/json';

    LOGGER.log(
      `${method} : ${this.protocol.toLowerCase()}//${this.host}:${
        this.port
      }/${this.buildCAPIPath(endpoint)}`,
    );

    return await this.client.sendRequest(
      this.host,
      this.port,
      this.buildCAPIPath(endpoint),
      method,
      this.buildHeader(contentType),
      timeout,
      method == 'POST' || method == 'PUT' ? body : undefined,
    );
  }
}
