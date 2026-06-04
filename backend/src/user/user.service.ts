import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { returnUserObject } from './return-user.object';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...returnUserObject,
        ...selectObject,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
