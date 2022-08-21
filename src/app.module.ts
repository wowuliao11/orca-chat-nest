import { WsStartGateway } from './ws.gateway';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { UsersController } from './modules/users/users.controller';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { mongoValidationFilter } from './filters/mongoServerError.filter';
import { validationFilter } from './filters/validation.filter';
import { LoggerInterceptor } from './interceptors/logger.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_SECRET_URL),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    WsStartGateway,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: validationFilter,
    },
    {
      provide: APP_FILTER,
      useClass: mongoValidationFilter,
    },
  ],
})
export class AppModule {}
