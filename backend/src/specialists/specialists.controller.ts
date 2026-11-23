import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "../auth/auth.service";
import { SpecialistDto } from "../common/dto";
import type { AuthRequest } from "../auth/auth.middleware";
@Controller("specialists")
export class SpecialistsController {
  constructor(
    private readonly db: PrismaService,
    private readonly auth: AuthService,
  ) {}
  @Get() list() {
    return this.db.specialist.findMany({
      where: { isActive: true },
      include: { _count: { select: { doctors: true } } },
    });
  }
  @Get(":id") one(@Param("id") id: string) {
    return this.db.specialist.findUniqueOrThrow({
      where: { id },
      include: {
        doctors: {
          where: { isActive: true },
          select: { id: true, name: true, description: true, avatarUrl: true },
        },
      },
    });
  }
  @Post() async create(@Req() req: AuthRequest, @Body() dto: SpecialistDto) {
    await this.auth.admin(req);
    return this.db.specialist.create({ data: dto });
  }
  @Patch(":id") async update(
    @Req() req: AuthRequest,
    @Param("id") id: string,
    @Body() dto: Partial<SpecialistDto>,
  ) {
    await this.auth.admin(req);
    return this.db.specialist.update({ where: { id }, data: dto });
  }
  @Delete(":id") async disable(
    @Req() req: AuthRequest,
    @Param("id") id: string,
  ) {
    await this.auth.admin(req);
    return this.db.specialist.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
