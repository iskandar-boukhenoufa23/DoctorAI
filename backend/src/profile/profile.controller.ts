import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileDto } from '../common/dto';
import type { AuthRequest } from '../auth/auth.middleware';
@Controller('profile')
export class ProfileController {
  constructor(private readonly auth: AuthService, private readonly db: PrismaService) {}
  @Get('me') me(@Req() req: AuthRequest) { return this.auth.me(req); }
  @Patch('me') async update(@Req() req: AuthRequest, @Body() dto: ProfileDto) {
    const user = await this.auth.me(req);
    return this.db.user.update({ where: { id: user.id }, data: dto });
  }
}
