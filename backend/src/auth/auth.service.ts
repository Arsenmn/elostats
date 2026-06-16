import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { hash, verify } from 'argon2';
import { faker } from '@faker-js/faker';
import { OAuthProvider, User } from '@prisma/client';
import { ConfirmAuthCodeDto } from './dto/confirm-auth-code.dto';
import { AuthVerificationService } from './auth-verification.service';
import { MailService } from './mail.service';
import { randomUUID } from 'crypto';

export type OAuthProfile = {
  provider: OAuthProvider;
  providerAccountId: string;
  email?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private authVerification: AuthVerificationService,
    private mail: MailService,
  ) {}

  async register(dto: AuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) throw new BadRequestException('User already exists');

    const verification = await this.authVerification.createCode({
      email: dto.email,
      purpose: 'register',
      passwordHash: await hash(dto.password),
    });

    this.mail.sendAuthCode(dto.email, verification.code);

    return {
      verificationId: verification.verificationId,
      expiresAt: verification.expiresAt,
      message: 'Confirmation code sent to your email',
    };
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);

    const verification = await this.authVerification.createCode({
      email: user.email,
      purpose: 'login',
      userId: user.id,
    });

    this.mail.sendAuthCode(user.email, verification.code);

    return {
      verificationId: verification.verificationId,
      expiresAt: verification.expiresAt,
      message: 'Confirmation code sent to your email',
    };
  }

  async confirmRegister(dto: ConfirmAuthCodeDto) {
    const verification = await this.authVerification.verifyCode({
      verificationId: dto.verificationId,
      code: dto.code,
      purpose: 'register',
    });

    if (!verification.passwordHash) {
      throw new BadRequestException('Invalid registration verification');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: verification.email,
      },
    });

    if (existingUser) throw new BadRequestException('User already exists');

    const user = await this.prisma.user.create({
      data: {
        email: verification.email,
        name: faker.person.firstName(),
        avatarPath: faker.image.avatar(),
        phone: faker.phone.number(),
        password: verification.passwordHash,
        isEmailConfirmed: true,
      },
    });

    const tokens = this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async confirmLogin(dto: ConfirmAuthCodeDto) {
    const verification = await this.authVerification.verifyCode({
      verificationId: dto.verificationId,
      code: dto.code,
      purpose: 'login',
    });

    if (!verification.userId) {
      throw new BadRequestException('Invalid login verification');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: verification.userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const tokens = this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async getNewTokens(refreshToken: string) {
    let result: { id: string };

    try {
      result = await this.jwt.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: result.id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const tokens = this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async authenticateOAuth(profile: OAuthProfile) {
    const account = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: profile.provider,
          providerAccountId: profile.providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });

    const user = account?.user ?? (await this.createOAuthUser(profile));

    if (!account) {
      await this.prisma.oAuthAccount.create({
        data: {
          provider: profile.provider,
          providerAccountId: profile.providerAccountId,
          email: profile.email,
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
          userId: user.id,
        },
      });
    }

    const tokens = this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  private issueTokens(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, { expiresIn: '1h' });
    const refreshToken = this.jwt.sign(data, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }

  private async createOAuthUser(profile: OAuthProfile) {
    const existingUser = profile.email
      ? await this.prisma.user.findUnique({
          where: {
            email: profile.email,
          },
        })
      : null;

    if (existingUser) {
      return existingUser;
    }

    return this.prisma.user.create({
      data: {
        email: profile.email,
        name: await this.createUniqueUserName(profile.displayName),
        avatarPath: profile.avatarUrl || faker.image.avatar(),
        phone: '',
        password: null,
        isEmailConfirmed: Boolean(profile.email),
      },
    });
  }

  private async createUniqueUserName(displayName?: string | null) {
    const baseName =
      displayName?.trim().replace(/\s+/g, '-').slice(0, 24) ||
      faker.internet.username().slice(0, 24);

    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate =
        attempt === 0
          ? baseName
          : `${baseName}-${faker.string.alphanumeric(5)}`;

      const existingUser = await this.prisma.user.findUnique({
        where: {
          name: candidate,
        },
      });

      if (!existingUser) {
        return candidate;
      }
    }

    return `${baseName}-${randomUUID().slice(0, 8)}`;
  }

  private async validateUser(
    dto: AuthDto,
  ): Promise<User & { email: string; password: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    if (!user.email || !user.password) {
      throw new UnauthorizedException('Use OAuth to sign in');
    }

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new UnauthorizedException('Invalid password');

    return user as User & { email: string; password: string };
  }
}
