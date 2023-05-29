import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.entity';
import { UsersModule } from './user/user.module';
import { AuthService } from './user/auth.service';
import { APP_PIPE } from '@nestjs/core';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      })
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(
      cookieSession({
        keys: ['abcde']
      })
    ).forRoutes('*');
  }
}
