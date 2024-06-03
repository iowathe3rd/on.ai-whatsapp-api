import { Direction, MessageType } from "@prisma/client";

/**
 * Interface representing the data required for creating a new message.
 */
export class CreateMessageDto {
    /**
     * The unique identifier of incoming message, you can use messages endpoint to mark it as read.
     */
    public wa_id: string;

    /**
     * The customer's phone number.
     */
    public from?: String;

    /**
     * The timestamp of when the message was sent.
     * Example: "<TIMESTAMP>"
     */
   public  timeStamp: String;

    /**
     * The type of message being received.
     *
     * # Supported values are:
     * - text: for text messages.
     * - image: for image (media) messages.
     * - interactive: for interactive messages.
     * - document: for document (media) messages.
     * - audio: for audio and voice (media)  messages.
     * - sticker: for sticker messages.
     * - order: for when a customer has placed an order.
     * - video: for video (media) messages.
     * - button: for responses to interactive message templates.
     * - contacts: for contact messages.
     * - location: for location messages.
     * - unknown: for unknown messages.
     * - system: for user number change messages.
     */
    public type: MessageType;

    /**
     * Indicates whether the message has been deleted or not.
     */
    public isDeleted: boolean;

    /**
     * The ID of the chat to which the message belongs.
     */
    public chatId: string;

    /**
     * The direction of the message (inbound or outbound).
     */
    public direction: Direction;
}
