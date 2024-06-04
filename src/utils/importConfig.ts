import { WAConfigType } from 'src/types/config';
import { WAConfigEnum } from 'src/types/enums';
import { configChecker } from './configChecker';
import Logger from './logger';

const LIB_NAME = 'IMPORT CONFIG';
const LOG_LOCAL = false;
const LOGGER = new Logger(LIB_NAME, process.env.DEBUG === 'true' || LOG_LOCAL);

const DEFAULT_BASE_URL = 'graph.facebook.com';
const DEFAULT_LISTENER_PORT = 3000;
const DEFAULT_MAX_RETRIES_AFTER_WAIT = 30;
const DEFAULT_REQUEST_TIMEOUT = 20000;

export const importConfig = (senderNumberId?: number) => {
  configChecker(senderNumberId);

  const config: WAConfigType = {
    [WAConfigEnum.BaseURL]: process.env.WA_BASE_URL || DEFAULT_BASE_URL,
    [WAConfigEnum.AppId]: process.env.M4D_APP_ID || '',
    [WAConfigEnum.AppSecret]: process.env.M4D_APP_SECRET || '',
    [WAConfigEnum.PhoneNumberId]:
      senderNumberId || parseInt(process.env.WA_PHONE_NUMBER_ID || ''),
    [WAConfigEnum.BusinessAcctId]: process.env.WA_BUSINESS_ACCOUNT_ID || '',
    [WAConfigEnum.APIVersion]: process.env.CLOUD_API_VERSION || '',
    [WAConfigEnum.AccessToken]: process.env.CLOUD_API_ACCESS_TOKEN || '',
    [WAConfigEnum.WebhookEndpoint]: process.env.WEBHOOK_ENDPOINT || '',
    [WAConfigEnum.WebhookVerificationToken]:
      process.env.WEBHOOK_VERIFICATION_TOKEN || '',
    [WAConfigEnum.ListenerPort]:
      parseInt(process.env.LISTENER_PORT || '') || DEFAULT_LISTENER_PORT,
    [WAConfigEnum.MaxRetriesAfterWait]:
      parseInt(process.env.MAX_RETRIES_AFTER_WAIT || '') ||
      DEFAULT_MAX_RETRIES_AFTER_WAIT,
    [WAConfigEnum.RequestTimeout]:
      parseInt(process.env.REQUEST_TIMEOUT || '') || DEFAULT_REQUEST_TIMEOUT,
    [WAConfigEnum.Debug]: process.env.DEBUG === 'true',
  };

  LOGGER.log(`Configuration loaded for App Id ${config[WAConfigEnum.AppId]}`);

  return config;
};
