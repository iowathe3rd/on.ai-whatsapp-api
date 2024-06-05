import { RequesterClass } from './requester';
import { WAConfigType } from './config';
import { Logger } from 'src/logger/logger.service';

export declare class BaseClass {
  constructor(
    config: WAConfigType,
    HttpsClient?: RequesterClass,
    logger?: Logger,
  );
}
