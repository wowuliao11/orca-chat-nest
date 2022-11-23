import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { RedisIoAdapter } from './modules/ws/redis.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: 'http://localhost:9000' },
  });
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(process.env.PORT || 4444);
}
bootstrap();
