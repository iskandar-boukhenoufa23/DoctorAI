import {
  Controller,
  Get,
  Headers,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
@Controller("internal")
export class InternalController {
  constructor(private readonly db: PrismaService) {}
  private check(token?: string) {
    const expected = process.env.INTERNAL_API_KEY;
    if (!expected || token !== `Bearer ${expected}`)
      throw new UnauthorizedException();
  }
  @Get("specialists") specialists(@Headers("authorization") token?: string) {
    this.check(token);
    return this.db.specialist.findMany({ where: { isActive: true } });
  }
  @Get("doctor-agents") async doctors(
    @Headers("authorization") token?: string,
    @Query("specialty") specialty?: string,
  ) {
    this.check(token);
    const doctors = await this.db.doctorAgent.findMany({
      where: {
        isActive: true,
        specialist: {
          isActive: true,
          ...(specialty ? { slug: specialty } : {}),
        },
      },
      include: { specialist: true },
    });
    return doctors.map((d: any) => ({
      id: d.id,
      name: d.name,
      specialty_slug: d.specialist.slug,
      system_prompt: d.systemPrompt,
      personality: d.personality,
      model_name: d.modelName,
      temperature: d.temperature,
      is_active: d.isActive,
    }));
  }
}
