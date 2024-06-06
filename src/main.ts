import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from './services/logger.service';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  logger.log('SERVER STARTED ON PORT 3000 🚀');
  await app.listen(3000);
}
bootstrap();
