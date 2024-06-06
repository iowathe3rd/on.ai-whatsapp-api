
import { IsString, IsNotEmpty, IsOptional, IsJSON } from 'class-validator';
import {MessageTypesEnum} from "../../../types/enums";
import {ContextObject} from "../../../types";
import {ContentObject, ReactionObject} from "../../../types/messages";

export class SendMessageDto {
    @IsNotEmpty()
    @IsString()
    to: string;

    @IsNotEmpty()
    type: MessageTypesEnum;

    @IsNotEmpty()
    @IsJSON()
    content: ContentObject; // Предположим, что содержимое сообщения может быть любого JSON-формата

    // Если поля не обязательны, используйте декораторы IsOptional
    @IsOptional()
    context?: ContextObject
    // Если поля не обязательны, используйте декораторы IsOptional
    @IsOptional()
    reaction?: ReactionObject;

    // Если поля не обязательны, используйте декораторы IsOptional
    @IsOptional()
    @IsString()
    additionalField?: string;
}
