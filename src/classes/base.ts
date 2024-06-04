import { BaseClass } from '../types/base';
import { RequesterClass } from '../types/requester';
import { WAConfigType } from '../types/config';
import { PinoLogger } from 'nestjs-pino';

export default class BaseAPI implements BaseClass {
  protected client: RequesterClass;
  protected config: WAConfigType;

  private readonly LOGGER = new PinoLogger({
    renameContext: 'WABA API CLIENT',
  });

  constructor(config: WAConfigType, HttpsClient: RequesterClass) {
    this.client = HttpsClient;
    this.config = config;

    this.LOGGER.info(`Initialized with HTTPSClient`);
  }
}
