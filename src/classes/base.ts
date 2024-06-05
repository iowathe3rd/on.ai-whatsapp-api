import { BaseClass } from '../types/base';
import { RequesterClass } from '../types/requester';
import { WAConfigType } from '../types/config';
import { Logger } from 'src/logger/logger.service';

export default class BaseAPI implements BaseClass {
  protected client: RequesterClass;
  protected config: WAConfigType;
  protected logger?: Logger;

  constructor(
    config: WAConfigType,
    HttpsClient: RequesterClass,
    logger?: Logger,
  ) {
    this.client = HttpsClient;
    this.config = config;
    this.logger = logger;
  }
}
