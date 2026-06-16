import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SteamModule } from './steam/steam.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { FaceitModule } from './faceit/faceit.module';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { AuthSteamModule } from './auth-steam/auth-steam.module';
import { AiAnalysisModule } from './ai-analysis/ai-analysis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SteamModule,
    AuthModule,
    UserModule,
    FaceitModule,
    AiAnalysisModule,
    AuthGoogleModule,
    AuthSteamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
