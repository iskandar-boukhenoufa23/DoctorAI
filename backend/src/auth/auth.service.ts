import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthRequest } from './auth.middleware';
@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService) {}
  async me(req: AuthRequest) {
    if (!req.clerkUserId) throw new ForbiddenException('Not authenticated');
    return this.db.user.upsert({ where: { clerkId: req.clerkUserId }, create: { clerkId: req.clerkUserId }, update: {} });
  }
  async admin(req: AuthRequest) {
    const user = await this.me(req);
    if (user.role !== 'ADMIN') throw new ForbiddenException('Admin required');
    return user;
  }
}
