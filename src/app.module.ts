import { AppGateway } from './modules/ws/ws.gateway';
import {
  CacheModule,
  CacheStore,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { UsersController } from './modules/users/users.controller';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { mongoValidationFilter } from './filters/mongoServerError.filter';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { CosModule } from './modules/cos/cos.module';
import { CosController } from './modules/cos/cos.controller';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { MailModule } from './modules/mail/mail.module';

import { RoomModule } from './modules/room/room.module';
import { HistoryModule } from './modules/history/history.module';
import { RolesGuard } from './modules/auth/role.guard';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_SECRET_URL),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            passphrase: process.env.REDIS_PASSWORD,
          },
          store: 'none',
          password: process.env.REDIS_PASSWORD,
        });
        return {
          store: store as unknown as CacheStore,
        };
      },
    }),
    AuthModule,
    UsersModule,
    CosModule,
    MailModule,
    RoomModule,
    HistoryModule,
  ],
  controllers: [AppController, UsersController, CosController],

  providers: [
    AppService,
    AppGateway,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
    {
      provide: APP_FILTER,
      useClass: mongoValidationFilter,
    },
  ],
})
export class AppModule {}
