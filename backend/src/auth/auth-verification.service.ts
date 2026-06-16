import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { randomInt } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

type AuthCodePurpose = 'register' | 'login';

const CODE_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

@Injectable()
export class AuthVerificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createCode(params: {
    email: string;
    purpose: AuthCodePurpose;
    userId?: string;
    passwordHash?: string;
  }) {
    const code = randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

    await this.prisma.authVerificationCode.updateMany({
      where: {
        email: params.email,
        purpose: params.purpose,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });

    const verification = await this.prisma.authVerificationCode.create({
      data: {
        email: params.email,
        purpose: params.purpose,
        userId: params.userId,
        passwordHash: params.passwordHash,
        codeHash: await hash(code),
        expiresAt,
      },
    });

    return {
      code,
      verificationId: verification.id,
      expiresAt,
    };
  }

  async verifyCode(params: {
    verificationId: string;
    code: string;
    purpose: AuthCodePurpose;
  }) {
    const verification = await this.prisma.authVerificationCode.findUnique({
      where: {
        id: params.verificationId,
      },
    });

    if (!verification || verification.purpose !== params.purpose) {
      throw new UnauthorizedException('Invalid verification code');
    }

    if (verification.usedAt) {
      throw new BadRequestException('Verification code has already been used');
    }

    if (verification.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Verification code has expired');
    }

    if (verification.attempts >= MAX_ATTEMPTS) {
      throw new BadRequestException('Too many verification attempts');
    }

    const isValid = await verify(verification.codeHash, params.code);

    if (!isValid) {
      await this.prisma.authVerificationCode.update({
        where: {
          id: verification.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      throw new UnauthorizedException('Invalid verification code');
    }

    return this.prisma.authVerificationCode.update({
      where: {
        id: verification.id,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }
}
