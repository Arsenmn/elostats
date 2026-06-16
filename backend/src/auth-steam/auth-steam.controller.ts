import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { AuthSteamService } from './auth-steam.service';

@Controller('auth/steam')
export class AuthSteamController {
  constructor(private readonly authSteamService: AuthSteamService) {}

  @Get()
  @Redirect()
  redirectToSteam() {
    return {
      url: this.authSteamService.getAuthorizationUrl(),
    };
  }

  @Get('callback')
  @Redirect()
  callback(@Query() query: Record<string, string | string[]>) {
    return this.authSteamService.authenticate(query);
  }
}
