import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { DoctorDto } from '../common/dto';
import type { AuthRequest } from '../auth/auth.middleware';
const publicDoctor = { id: true, name: true, description: true, avatarUrl: true, isActive: true, specialist: { select: { id: true, name: true, slug: true } }, reviews: { select: { rating: true } } } as const;
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly db: PrismaService, private readonly auth: AuthService) {}
  @Get() list(@Query('specialty') specialty?: string) { return this.db.doctorAgent.findMany({ where: { isActive: true, specialist: { isActive: true, ...(specialty ? { slug: specialty } : {}) } }, select: publicDoctor }); }
  @Get(':id') one(@Param('id') id: string) { return this.db.doctorAgent.findFirstOrThrow({ where: { id, isActive: true }, select: publicDoctor }); }
  @Post() async create(@Req() req: AuthRequest, @Body() dto: DoctorDto) { await this.auth.admin(req); return this.db.doctorAgent.create({ data: { ...dto, personality: dto.personality as any } }); }
  @Patch(':id') async update(@Req() req: AuthRequest, @Param('id') id: string, @Body() dto: Partial<DoctorDto>) { await this.auth.admin(req); return this.db.doctorAgent.update({ where: { id }, data: { ...dto, personality: dto.personality as any, promptVersion: { increment: 1 } } }); }
  @Delete(':id') async disable(@Req() req: AuthRequest, @Param('id') id: string) { await this.auth.admin(req); return this.db.doctorAgent.update({ where: { id }, data: { isActive: false } }); }
}
