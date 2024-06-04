import { WAConfigType } from 'src/types/config';
import { WhatsAppClass } from 'src/types/WhatsApp';
import * as SDKEnums from 'src/types/enums';
import Logger from 'src/utils/logger';
import Requester from 'src/utils/requester';
import MessagesAPI from './messages';
import PhoneNumbersAPI from './phoneNumbers';
import TwoStepVerificationAPI from './twoStepVerification';
import { importConfig } from 'src/utils/importConfig';

const LIB_NAME = 'WHATSAPP';
const LOG_LOCAL = false;
const LOGGER = new Logger(LIB_NAME, process.env.DEBUG === 'true' || LOG_LOCAL);

export default class WhatsApp implements WhatsAppClass {
  config: WAConfigType;
  requester: Readonly<Requester>;

  readonly messages: MessagesAPI;
  readonly phoneNumbers: PhoneNumbersAPI;
  readonly twoStepVerification: TwoStepVerificationAPI;
  static readonly Enums = SDKEnums;

  constructor(senderNumberId?: number) {
    this.config = importConfig(senderNumberId);
    this.requester = new Requester(
      this.config[SDKEnums.WAConfigEnum.BaseURL],
      this.config[SDKEnums.WAConfigEnum.APIVersion],
      this.config[SDKEnums.WAConfigEnum.PhoneNumberId],
      this.config[SDKEnums.WAConfigEnum.AccessToken],
    );

    this.messages = new MessagesAPI(this.config, this.requester);
    this.phoneNumbers = new PhoneNumbersAPI(this.config, this.requester);
    this.twoStepVerification = new TwoStepVerificationAPI(
      this.config,
      this.requester,
    );

    LOGGER.log('WHATSAPP API CLIENT INITIALIZED');
  }
}
