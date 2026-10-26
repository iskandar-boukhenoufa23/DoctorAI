import { BadRequestException, Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { ReviewDto } from '../common/dto';
import type { AuthRequest } from '../auth/auth.middleware';
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly db: PrismaService, private readonly auth: AuthService) {}
  @Get('doctor/:doctorId') list(@Param('doctorId') doctorId: string) { return this.db.doctorReview.findMany({ where: { doctorId }, select: { id: true, rating: true, comment: true, createdAt: true }, orderBy: { createdAt: 'desc' } }); }
  @Post() async create(@Req() req: AuthRequest, @Body() dto: ReviewDto) {
    const user = await this.auth.me(req);
    const consultation = await this.db.consultation.findFirst({ where: { id: dto.consultationId, patientId: user.id, status: 'COMPLETED' } });
    if (!consultation?.doctorId) throw new BadRequestException('Completed doctor consultation required');
    return this.db.doctorReview.create({ data: { patientId: user.id, doctorId: consultation.doctorId, consultationId: consultation.id, rating: dto.rating, comment: dto.comment } });
  }
}
