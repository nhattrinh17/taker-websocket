import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SocketIoAdapter } from '@common/adapters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  console.log('🚀 ~ bootstrap ~ port: ', port);

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(port);
}
bootstrap();
