import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AuthService } from 'src/auth/auth.service';
import { OAuthProvider } from '@prisma/client';

@Injectable()
export class AuthGoogleService {
  private google: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    this.google = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.getCallbackUrl(),
    );
  }

  getAuthorizationUrl() {
    this.assertGoogleConfigured();

    return this.google.generateAuthUrl({
      access_type: 'offline',
      prompt: 'select_account',
      redirect_uri: this.getCallbackUrl(),
      scope: ['openid', 'email', 'profile'],
    });
  }

  async authenticate(code: string) {
    if (!code) {
      throw new BadRequestException('Google authorization code is required');
    }

    this.assertGoogleConfigured();

    const { tokens } = await this.google.getToken({
      code,
      redirect_uri: this.getCallbackUrl(),
    });

    if (!tokens.id_token) {
      throw new BadRequestException('Google did not return an ID token');
    }

    const ticket = await this.google.verifyIdToken({
      idToken: tokens.id_token,
      audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
    });
    const payload = ticket.getPayload();

    if (!payload?.sub) {
      throw new BadRequestException('Invalid Google profile');
    }

    const response = await this.authService.authenticateOAuth({
      provider: OAuthProvider.GOOGLE,
      providerAccountId: payload.sub,
      email: payload.email,
      displayName: payload.name,
      avatarUrl: payload.picture,
    });

    return {
      url: this.getFrontendCallbackUrl(
        response.accessToken,
        response.refreshToken,
      ),
    };
  }

  private getCallbackUrl() {
    const configuredCallbackUrl = this.configService.get<string>(
      'GOOGLE_CALLBACK_URL',
    );

    if (configuredCallbackUrl) {
      return configuredCallbackUrl;
    }

    return `${this.getBackendUrl()}/api/auth/google/callback`;
  }

  private getBackendUrl() {
    const backendDomain =
      this.configService.get<string>('BACKEND_DOMAIN') ?? 'http://localhost';
    const port = this.configService.get<string>('PORT') ?? '3000';
    const url = new URL(backendDomain);

    if (
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1') &&
      !url.port
    ) {
      url.port = port;
    }

    return url.toString().replace(/\/$/, '');
  }

  private assertGoogleConfigured() {
    if (
      !this.configService.get<string>('GOOGLE_CLIENT_ID') ||
      !this.configService.get<string>('GOOGLE_CLIENT_SECRET')
    ) {
      throw new InternalServerErrorException('Google OAuth is not configured');
    }
  }

  private getFrontendCallbackUrl(accessToken: string, refreshToken: string) {
    const frontendDomain =
      this.configService.get<string>('FRONTEND_DOMAIN') ??
      'http://localhost:5173';
    const callbackUrl = new URL('/auth/oauth/callback', frontendDomain);
    const params = new URLSearchParams({
      accessToken,
      refreshToken,
    });

    return `${callbackUrl.toString()}#${params.toString()}`;
  }
}
