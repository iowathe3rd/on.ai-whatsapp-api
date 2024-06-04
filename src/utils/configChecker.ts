import { PinoLogger } from 'nestjs-pino';
import { WARequiredConfigEnum } from 'src/types/enums';

const LOGGER = new PinoLogger({
  renameContext: 'CONFIG CHECKER',
});

export const configChecker = (senderNumberId?: number) => {
  if (
    (process.env.WA_PHONE_NUMBER_ID === undefined ||
      process.env.WA_PHONE_NUMBER_ID === '') &&
    senderNumberId == undefined
  ) {
    LOGGER.info(
      `Environmental variable: WA_PHONE_NUMBER_ID and/or sender phone number id arguement is undefined.`,
    );
    throw new Error('Missing WhatsApp sender phone number Id.');
  }

  for (const value of Object.values(WARequiredConfigEnum)) {
    LOGGER.info(value + ' ---- ' + process.env[`${value}`]);
    if (
      process.env[`${value}`] === undefined ||
      process.env[`${value}`] === ''
    ) {
      LOGGER.info(`Environmental variable: ${value} is undefined`);
      throw new Error('Invalid configuration.');
    }
  }
};
