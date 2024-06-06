import {Injectable} from '@nestjs/common';
import {SendMessageDto} from './dto/send-message.dto';
import WhatsApp from "../../classes/Whatsapp";
import {MessageTypesEnum, StatusEnum} from "../../types/enums";
import {TextObject} from "../../types/messages";
import prisma from "../../lib/db";

@Injectable()
export class MessagesService {
  private readonly waba: WhatsApp = new WhatsApp();
  async send(dto: SendMessageDto) {
    const { type, content } = dto;

    switch (type) {
      case MessageTypesEnum.Text: {
        await this.waba.messages.text(dto.content as TextObject, `78${dto.to.slice(1)}
        break;
      }

/*
      case Messag/!*eTypesEnum.Contacts: {
        await this.waba.messages.text({

        }, dto.to)
        break;
      }

      case MessageTypesEnum.Document: {
        await this.waba.messages.text({

        }, dto.to)
        break;
      }

      case MessageTypesEnum.Image: {
        await this.waba.messages.text({

        }, dto.to)
        break;
      }

      case MessageTypesEnum.Interactive: {
        await this.waba.messages.text({

        }, dto.to)
        break;
      }

      case MessageTypesEnum.Location: {
        await this.waba.messages.text({

        }, dto.to)
        break;
      }

      case MessageTypesEnum.Reaction: {
        await this.waba.messages.text({

        }, dto.to)
        break;
      }
      case MessageTypesEnum.Sticker: {
        await this.waba.messages.text({

        }, dto.to)
        break;
      }

      case MessageTypesEnum.Template: {
        await this.waba.messages.text({

        }, dto.to)
        break;
      }

      case MessageTypesEnum.Text: {
        await this.waba.messages.text({

        }, dto.to)
        break;
      }

      case MessageTypesEnum.Video: {
        await this.waba.messages.text({

        }, dto.to)
        break;
      }*!/
*/

      default:
        throw new Error(`Unsupported message type: ${type}`);
    }

    // Здесь должна быть логика отправки сообщения через WhatsApp
    return 'This action adds a new message';
  }

}
