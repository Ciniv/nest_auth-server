import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.entity';
import { UsersModule } from './user/user.module';
import { AuthService } from './user/auth.service';

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
  providers: [UserService, AuthService],
})
export class AppModule {}
