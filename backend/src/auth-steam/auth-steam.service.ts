import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuthProvider } from '@prisma/client';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';

type SteamPlayer = {
  steamid: string;
  personaname?: string;
  avatarfull?: string;
};

@Injectable()
export class AuthSteamService {
  private readonly openIdUrl = 'https://steamcommunity.com/openid/login';

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  getAuthorizationUrl() {
    const params = new URLSearchParams({
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'checkid_setup',
      'openid.return_to': this.getCallbackUrl(),
      'openid.realm': this.getRealm(),
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    });

    return `${this.openIdUrl}?${params.toString()}`;
  }

  async authenticate(query: Record<string, string | string[]>) {
    const flatQuery = this.flattenQuery(query);

    await this.verifySteamResponse(flatQuery);
    const steamId = this.extractSteamId(flatQuery['openid.claimed_id']);
    const profile = await this.getSteamProfile(steamId);

    const response = await this.authService.authenticateOAuth({
      provider: OAuthProvider.STEAM,
      providerAccountId: steamId,
      displayName: profile?.personaname ?? `steam-${steamId}`,
      avatarUrl: profile?.avatarfull,
    });

    return {
      url: this.getFrontendCallbackUrl(
        response.accessToken,
        response.refreshToken,
      ),
    };
  }

  private async verifySteamResponse(query: Record<string, string>) {
    const params = new URLSearchParams(query);
    params.set('openid.mode', 'check_authentication');

    const { data } = await axios.post(this.openIdUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      responseType: 'text',
    });

    if (!String(data).includes('is_valid:true')) {
      throw new UnauthorizedException('Invalid Steam OpenID response');
    }
  }

  private extractSteamId(claimedId?: string) {
    const match = claimedId?.match(
      /^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/,
    );

    if (!match) {
      throw new BadRequestException('Invalid Steam claimed ID');
    }

    return match[1];
  }

  private async getSteamProfile(steamId: string): Promise<SteamPlayer | null> {
    const steamApiKey = this.configService.get<string>('STEAM_API_KEY');

    if (!steamApiKey) {
      return null;
    }

    const { data } = await axios.get<{
      response?: {
        players?: SteamPlayer[];
      };
    }>('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/', {
      params: {
        key: steamApiKey,
        steamids: steamId,
      },
    });

    return data.response?.players?.[0] ?? null;
  }

  private flattenQuery(query: Record<string, string | string[]>) {
    return Object.entries(query).reduce<Record<string, string>>(
      (params, [key, value]) => {
        params[key] = Array.isArray(value) ? value[0] : value;
        return params;
      },
      {},
    );
  }

  private getCallbackUrl() {
    const configuredCallbackUrl =
      this.configService.get<string>('STEAM_CALLBACK_URL');

    if (configuredCallbackUrl) {
      return configuredCallbackUrl;
    }

    return `${this.getBackendUrl()}/api/auth/steam/callback`;
  }

  private getRealm() {
    return (
      this.configService.get<string>('STEAM_REALM') ?? this.getBackendUrl()
    );
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
