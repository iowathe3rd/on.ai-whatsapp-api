import {
  ConversationTypesEnum,
  CurrencyCodesEnum,
  DocumentMediaTypesEnum,
  ImageMediaTypesEnum,
  MessageTypesEnum,
  ReferralSourceTypesEnum,
  StatusEnum,
  StickerMediaTypesEnum,
  SystemChangeTypesEnum,
  VideoMediaTypesEnum,
  WebhookTypesEnum,
} from './enums';

export type PricingObject = {
  category: ConversationTypesEnum;
  pricing_model: 'CBP';
};

export type OriginObject = {
  type: ConversationTypesEnum;
};

export type ConversationObject = {
  id: string;
  origin: OriginObject;
  expiration_timestamp: string;
};

export type ErrorDataObject = {
  details: string;
};

export type ErrorObject = {
  code: number;
  title: string;
  message: string;
  error_data: ErrorDataObject;
};

export type StatusesObject = {
  conversation: ConversationObject;
  errors: ErrorObject[];
  id: string;
  pricing: PricingObject;
  recipient_id: string;
  status: StatusEnum;
  timestamp: string;
};

export type AudioObject = {
  id: string;
  mime_type: string;
};

export type ButtonObject = {
  payload: string;
  text: string;
};

export type ConTextObject = {
  forwarded: boolean;
  frequently_forwarded: boolean;
  from: string;
  id: string;
  referred_product: {
    catalog_id: string;
    product_retailer_id: string;
  };
};

export type DocumentObject = {
  caption: string;
  filename: string;
  sha256: string;
  mime_type: DocumentMediaTypesEnum;
  id: string;
};

export type IdentityObject = {
  acknowledged: string;
  created_timestamp: string;
  hash: string;
};

export type ImageObject = {
  caption: string;
  sha256: string;
  id: string;
  mime_type: ImageMediaTypesEnum;
};

export type ButtonReplyObject = {
  button_reply: {
    id: string;
    title: string;
  };
};

export type ListReplyObject = {
  list_reply: {
    id: string;
    title: string;
    description: string;
  };
};

export type InteractiveObject = {
  type: ButtonReplyObject | ListReplyObject;
};

export type ProductItemsObject = {
  product_retailer_id: string;
  quantity: string;
  item_price: string;
  currency: CurrencyCodesEnum;
};

export type Order_Object = {
  catalog_id: string;
  text: string;
  product_items: ProductItemsObject;
};

export type ReferralObject = {
  source_url: string;
  source_type: ReferralSourceTypesEnum;
  source_id: string;
  headline: string;
  body: string;
  media_type: ImageMediaTypesEnum | VideoMediaTypesEnum;
  image_url: string;
  video_url: string;
  thumbnail_url: string;
};

export type StickerObject = {
  mime_type: StickerMediaTypesEnum;
  sha256: string;
  id: string;
  animated: boolean;
};

export type SystemObject = {
  body: string;
  identity: string;
  wa_id: string;
  type: SystemChangeTypesEnum;
  customer: string;
};

export type TextObject = {
  body: string;
};

export type VideoObject = {
  caption: string;
  filename: string;
  sha256: string;
  id: string;
  mime_type: VideoMediaTypesEnum;
};

export type MessagesObject = {
  audio?: AudioObject;
  button?: ButtonObject;
  context?: ConTextObject;
  document?: DocumentObject;
  errors: ErrorObject[];
  from: string;
  id: string;
  identity?: IdentityObject;
  image?: ImageObject;
  interactive?: InteractiveObject;
  order?: Order_Object;
  referral: ReferralObject;
  sticker?: StickerObject;
  system?: SystemObject;
  text?: TextObject;
  timestamp: string;
  type: MessageTypesEnum;
  video?: VideoObject;
};

export type ProfileObject = {
  name: string;
};

export type ContactObject = {
  wa_id: string;
  profile: ProfileObject;
};

export type MetadataObject = {
  display_phone_number: string;
  phoneNumberId: string;
};

export type ValueObject = {
  messaging_product: 'whatsapp';
  contacts: ContactObject[];
  errors: ErrorObject[];
  messages: MessagesObject[];
  metadata: MetadataObject[];
  statuses: StatusesObject[];
};

export type ChangesObject = {
  field: string;
  value: ValueObject;
};

export type Entry_Object = {
  id: string;
  changes: ChangesObject[];
};

export type WebhookObject = {
  object: 'whatsapp_business_account';
  entry: Entry_Object[];
};

export type WebhookSubscribeQuery = {
  hub: {
    mode: 'subscribe';
    challenge: string;
    verify_token: string;
  };
};
