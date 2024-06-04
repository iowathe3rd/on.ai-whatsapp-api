import { Injectable, Logger } from '@nestjs/common';
import { ClientOptions, Client, InvalidBucketNameError } from 'minio';
import { MessagesObject } from 'src/types';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private minioClient: Client;
  private readonly bucketName: string;

  constructor() {
    const { MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_ENDPOINT, MINIO_BUCKET } =
      process.env;

    // Проверка наличия необходимых переменных окружения
    if (
      !MINIO_ACCESS_KEY ||
      !MINIO_SECRET_KEY ||
      !MINIO_ENDPOINT ||
      !MINIO_BUCKET
    ) {
      throw new Error(
        'Minio access key, secret key, endpoint, and bucket are required',
      );
    }

    const minioOptions: ClientOptions = {
      endPoint: MINIO_ENDPOINT,
      accessKey: MINIO_ACCESS_KEY,
      secretKey: MINIO_SECRET_KEY,
    };

    // Создание клиента Minio
    this.minioClient = new Client(minioOptions);
    this.bucketName = MINIO_BUCKET;

    // Проверка наличия бакета
    this.ensureBucketExists(MINIO_BUCKET);
  }

  async saveMediaToMinio(message: MessagesObject): Promise<void> {
    const mediaTypes = ['audio', 'image', 'sticker', 'video', 'document'];

    for (const type of mediaTypes) {
      const { id, mime_type, sha256, caption, filename } = message[type] || {};

      if (id && mime_type && sha256 && filename) {
        const objectPath = `whatsapp/${id}`;

        try {
          const uploadedObject = await this.uploadMediaToMinio(
            filename,
            objectPath,
            mime_type,
            sha256,
          );

          // Логика сохранения метаданных медиа файла в базе данных
          await this.saveMediaMetadataToDatabase(
            id,
            mime_type,
            sha256,
            caption,
            filename,
            uploadedObject,
          );
        } catch (error) {
          this.logger.error(
            `Error uploading media ${id} to Minio: ${error.message}`,
          );
        }
      } else {
        this.logger.warn(`Missing media data for ${type} in message`);
      }
    }
  }

  private async uploadMediaToMinio(
    objectName: string,
    objectPath: string,
    mimeType: string,
    sha256: string,
  ): Promise<{ bucket: string; key: string }> {
    try {
      // Загружаем медиа файл из WhatsApp в Minio
      await this.minioClient.fPutObject(
        this.bucketName,
        objectPath,
        objectName,
        {
          'Content-Type': mimeType,
          'x-amz-meta-sha256': sha256,
        },
      );

      return { bucket: this.bucketName, key: objectPath };
    } catch (error) {
      this.logger.error(`Error uploading media to Minio: ${error.message}`);
      throw error;
    }
  }

  private async downloadMediaFromWhatsApp(sha256: string): Promise<Buffer> {
    // Логика загрузки медиа файла из WhatsApp
    // ...
    return Buffer.from([]);
  }

  private async saveMediaMetadataToDatabase(
    id: string,
    mimeType: string,
    sha256: string,
    caption: string,
    filename: string,
    { bucket, key }: { bucket: string; key: string },
  ): Promise<void> {
    try {
      // Логика сохранения метаданных медиа файла в базе данных
      // ...
      this.logger.log(`Saved media ${id} to ${bucket}/${key}`);
    } catch (error) {
      this.logger.error(
        `Error saving media ${id} metadata to database: ${error.message}`,
      );
    }
  }

  private async ensureBucketExists(bucketName: string): Promise<void> {
    try {
      const bucketExists = await this.minioClient.bucketExists(bucketName);

      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName);
        this.logger.log(`Created bucket ${bucketName}`);
      } else {
        this.logger.log(`Bucket ${bucketName} already exists`);
      }
    } catch (error) {
      if (error.code === InvalidBucketNameError) {
        this.logger.error(`Bucket ${bucketName} does not exist`);
      } else {
        this.logger.error(
          `Error checking or creating bucket ${bucketName}: ${error.message}`,
        );
      }
    }
  }
}
