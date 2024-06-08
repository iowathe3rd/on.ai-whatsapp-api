import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from './services/logger.service';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {VersioningType} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger()
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  const config = new DocumentBuilder()
      .setTitle('Whatsapp api wrapper')
      .setDescription('Whatsapp api wrapper that can recieve and proceed webhooks and send messages')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  console.log('SERVER STARTED ON PORT 3000 🚀');
  await app.listen(3000);
}
bootstrap();
