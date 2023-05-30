import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/user.entity';
import { UsersModule } from './user/user.module';
import { AuthService } from './user/auth.service';
import { APP_PIPE } from '@nestjs/core';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          url: config.get<string>('POSTGRES_URL'),
          synchronize: true,
          entities: [User],
        };
      },
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

  constructor(private config: ConfigService){}

  configure(consumer: MiddlewareConsumer){
    consumer.apply(
      cookieSession({
        keys: [this.config.get<string>('COOKIE_KEY')]
      })
    ).forRoutes('*');
  }
}
