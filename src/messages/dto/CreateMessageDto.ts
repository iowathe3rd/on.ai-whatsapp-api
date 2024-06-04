export class CreateMessageDto {
  /**
   * Recipient phone number of the message (replace 'string' with a phone number type if available)
   */
  to: string;

  /**
   * Text content of the message (optional for non-text messages)
   */
  content?: string;

  /**
   * Type of the message (refer to MessageType enum in your schema)
   */
  type: MessageType;

  /**
   * Direction of the message (Inbound or Outbound)
   */
  direction: Direction;

  /**
   * (Optional) URL of the media file (image, audio, video, etc.)
   */
  mediaUrl?: string;
}
