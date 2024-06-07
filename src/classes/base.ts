import { BaseClass } from '../types/base';
import { RequesterClass } from '../types/requester';
import { WAConfigType } from '../types/config';
import { Logger } from 'src/services/logger.service';

export default class BaseAPI implements BaseClass {
  protected client: RequesterClass;
  protected config: WAConfigType;

  constructor(
    config: WAConfigType,
    HttpsClient: RequesterClass,
  ) {
    this.client = HttpsClient;
    this.config = config;
  }
}
