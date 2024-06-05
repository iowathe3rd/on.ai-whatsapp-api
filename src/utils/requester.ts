import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import HttpsClient from './httpsClient';
import { HttpMethodsEnum } from 'src/types/enums';
import { RequesterClass, GeneralHeaderInterface } from 'src/types/requester';
import { Logger } from 'src/logger/logger.service';

export default class Requester implements RequesterClass {
  accessToken: Readonly<string>;
  phoneNumberId: Readonly<number>;
  apiVersion: Readonly<string>;
  host: Readonly<string>;
  private readonly logger: Logger; // Добавляем экземпляр Logger

  private readonly axiosInstance: AxiosInstance;

  constructor(
    host: string,
    apiVersion: string,
    phoneNumberId: number,
    accessToken: string,
  ) {
    this.host = host;
    this.apiVersion = apiVersion;
    this.phoneNumberId = phoneNumberId;
    this.accessToken = accessToken;

    this.axiosInstance = axios.create({
      baseURL: this.host,
    });

    this.logger = new Logger('REQUESTER'); // Инициализируем экземпляр Logger
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
    const url = this.buildCAPIPath(endpoint);
    const headers: GeneralHeaderInterface = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    };
    const config: AxiosRequestConfig = {
      method,
      url,
      headers,
      timeout,
      data: body,
    };

    try {
      this.logger.debug(`Sending ${method} request to ${url}`); // Логируем отправку запроса
      const response = await this.axiosInstance.request(config);
      this.logger.debug(
        `Received response: ${response.status} ${response.statusText}`,
      ); // Логируем ответ
      return response.data;
    } catch (error) {
      this.logger.error('Error sending request:', error); // Логируем ошибку
      throw error;
    }
  }
}
