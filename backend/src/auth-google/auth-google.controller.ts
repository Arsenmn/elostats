import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';

@Controller('auth/google')
export class AuthGoogleController {
  constructor(private readonly authGoogleService: AuthGoogleService) {}

  @Get()
  @Redirect()
  redirectToGoogle() {
    return {
      url: this.authGoogleService.getAuthorizationUrl(),
    };
  }

  @Get('callback')
  @Redirect()
  callback(@Query('code') code: string) {
    return this.authGoogleService.authenticate(code);
  }
}
