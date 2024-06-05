import { WARequiredConfigEnum } from 'src/types/enums';
export const configChecker = (senderNumberId?: number) => {
  if (
    (process.env.WA_PHONE_NUMBER_ID === undefined ||
      process.env.WA_PHONE_NUMBER_ID === '') &&
    senderNumberId == undefined
  ) {

    throw new Error('Missing WhatsApp sender phone number Id.');
  }

  for (const value of Object.values(WARequiredConfigEnum)) {
    if (
      process.env[`${value}`] === undefined ||
      process.env[`${value}`] === ''
    ) {
      throw new Error('Invalid configuration.');
    }
  }
};
