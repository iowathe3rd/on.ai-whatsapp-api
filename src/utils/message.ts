import {MessagesObject} from "../types";
import {WebhookTypesEnum} from "../types/enums";
export const getMessageContent = (type: WebhookTypesEnum, dto: MessagesObject) => {
    return dto[type]
};
