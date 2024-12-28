import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common';
import {AuthSeeder} from './seeder/auth.seeder'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const seeder = app.get(AuthSeeder);
  await seeder.run();
  app.enableCors({
    origin: 'http://localhost:5173', 
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
