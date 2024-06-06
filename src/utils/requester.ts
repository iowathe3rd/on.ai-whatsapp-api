import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {HttpMethodsEnum} from 'src/types/enums';
import {RequesterClass} from 'src/types/requester';
import {Logger} from 'src/logger/logger.service';
import {normalizeUrl} from "./index";

export default class Requester implements RequesterClass {
  accessToken: Readonly<string>;
  phoneNumberId: Readonly<number>;
  apiVersion: Readonly<string> = "v19.0";
  host: Readonly<string> = "https://graph.facebook.com";
  private readonly logger: Logger = new Logger("REQUESTER"); // Добавляем экземпляр Logger

  private readonly axiosInstance: AxiosInstance;

  constructor(
      host: string,
      apiVersion: string,
      phoneNumberId: number,
      accessToken: string,
  ) {
    this.host = normalizeUrl("https://graph.facebook.com/");
    this.logger.debug(`Initialized with host: ${this.host}`);

    this.apiVersion = apiVersion;
    this.logger.debug(`Using API version: ${this.apiVersion}`);

    this.phoneNumberId = phoneNumberId;
    this.logger.debug(`Phone number ID: ${this.phoneNumberId}`);

    this.accessToken = accessToken;
    this.logger.debug(`Access token set: ${this.accessToken}`);

    this.axiosInstance = axios.create({
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      baseURL: this.host
    });

    this.axiosInstance.interceptors.request.use(
        function (value) {
          console.log(value.headers)
          return value;
        },
        function (error) {
          // Do something with request error
          return Promise.reject(error)
        }
    )
    this.logger.debug('Requester instance created');
  }
  async sendCAPIRequest<T>(
      method: HttpMethodsEnum,
      endpoint: string,
      timeout: number,
      body?: any,
  ): Promise<T | null > {
    const url = `/${this.apiVersion}/${this.phoneNumberId}/${endpoint}`;
    const config: AxiosRequestConfig = {
      method: method,
      url: url,
      data: body,
      timeout: timeout
    };

    try {
      this.logger.debug(`Sending ${method} request to ${url} with config: ${JSON.stringify(config)}`);
      const response = await this.axiosInstance.request<T>(config);
      this.logger.debug(`Received response from ${url}: ${JSON.stringify(response?.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error sending request to ${url}: ${error}`);
      throw new Error(`Failed to send ${method} request to ${url}: ${error.message}`);
    }
  }
}
