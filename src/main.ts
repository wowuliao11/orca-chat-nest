declare const module: any;
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { RedisIoAdapter } from './modules/ws/redis.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
    },
  });
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(process.env.PORT || 4444);
}
bootstrap();
