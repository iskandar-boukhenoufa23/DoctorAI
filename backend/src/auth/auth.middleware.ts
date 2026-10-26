import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import type { Request, Response, NextFunction } from 'express';
export type AuthRequest = Request & { clerkUserId?: string };
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: AuthRequest, _res: Response, next: NextFunction) {
    const match = /^Bearer (.+)$/i.exec(req.headers.authorization ?? '');
    if (!match) throw new UnauthorizedException('Bearer token required');
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) throw new UnauthorizedException('Clerk server configuration missing');
    try {
      const claims = await verifyToken(match[1], { secretKey });
      if (!claims.sub) throw new Error('No subject');
      req.clerkUserId = claims.sub;
      next();
    } catch { throw new UnauthorizedException('Invalid Clerk token'); }
  }
}
