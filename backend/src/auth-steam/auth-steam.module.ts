import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { AuthSteamController } from './auth-steam.controller';
import { AuthSteamService } from './auth-steam.service';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [AuthSteamController],
  providers: [AuthSteamService],
})
export class AuthSteamModule {}
