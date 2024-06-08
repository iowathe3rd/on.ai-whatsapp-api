
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsJSON,
    IsEnum,
    ValidateNested,
    IsBoolean,
    ValidateIf,
    IsObject
} from 'class-validator';
import {MessageTypesEnum} from "../../../types/enums";
import {
    AudioMediaObject,
    ContactObject,
    ContentObject,
    ConTextObject, DocumentMediaObject, ImageMediaObject, InteractiveObject, LocationObject, MessageTemplateObject,
    ReactionObject, StickerMediaObject,
    TextObject, VideoMediaObject
} from "../../../types/messages";
import {ApiProperty, ApiPropertyOptional, getSchemaPath} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {MessageType} from "@prisma/client";


export class SendMessageDto {
    @ApiProperty({
        description: 'The recipient\'s phone number',
        example: '1234567890'
    })
    @IsNotEmpty()
    @IsString()
    to: string;


    @ApiProperty({
        description: 'Type of the message',
        enum: MessageType,
        example: MessageType.text
    })
    @IsNotEmpty()
    @IsEnum(MessageType)
    type: MessageTypesEnum;


    @ApiProperty({
        description: 'Content of the message, in JSON format',
        example: { body: 'Hello, world!' },
    })
    @IsNotEmpty()
    @ValidateNested()
    @IsJSON()
    content: ContentObject; // Предположим, что содержимое сообщения может быть любого JSON-формата

    @ApiPropertyOptional({
        description: 'Context of the message, if applicable, like message for reply id',
        example: { message_id: '1234' }
    })
    @IsOptional()
    @ValidateNested()
    context?: ConTextObject;

    @ApiPropertyOptional({
        description: 'Reaction to the message, if applicable',
        example: {
            message_id: '1234',
            emoji: '👍'
        }
    })
    @IsOptional()
    @ValidateNested()
    reaction?: ReactionObject;
}
