import { BaseClass } from '../types/base';
import { RequesterClass } from '../types/requester';
import { WAConfigType } from '../types/config';
import Logger from 'src/utils/logger';

const LIB_NAME = 'BaseAPI';
const LOG_LOCAL = false;
const LOGGER = new Logger(LIB_NAME, process.env.DEBUG === 'true' || LOG_LOCAL);

export default class BaseAPI implements BaseClass {
  protected client: RequesterClass;
  protected config: WAConfigType;

  constructor(config: WAConfigType, HttpsClient: RequesterClass) {
    this.client = HttpsClient;
    this.config = config;

    LOGGER.log(`Initialized with HTTPSClient`);
  }
}
