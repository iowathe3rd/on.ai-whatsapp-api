import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './CreateMessageDto';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
