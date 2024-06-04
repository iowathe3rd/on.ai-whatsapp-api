import { WARequiredConfigEnum } from 'src/types/enums';
import Logger from 'src/utils/logger';

const LIB_NAME = 'CONFIG CHECKER';
const LOG_LOCAL = false;

const LOGGER = new Logger(LIB_NAME, process.env.DEBUG === 'true' || LOG_LOCAL);

export const configChecker = (senderNumberId?: number) => {
  if (
    (process.env.WA_PHONE_NUMBER_ID === undefined ||
      process.env.WA_PHONE_NUMBER_ID === '') &&
    senderNumberId == undefined
  ) {
    LOGGER.log(
      `Environmental variable: WA_PHONE_NUMBER_ID and/or sender phone number id arguement is undefined.`,
    );
    throw new Error('Missing WhatsApp sender phone number Id.');
  }

  for (const value of Object.values(WARequiredConfigEnum)) {
    LOGGER.log(value + ' ---- ' + process.env[`${value}`]);
    if (
      process.env[`${value}`] === undefined ||
      process.env[`${value}`] === ''
    ) {
      LOGGER.log(`Environmental variable: ${value} is undefined`);
      throw new Error('Invalid configuration.');
    }
  }
};
