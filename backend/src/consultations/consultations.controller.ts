import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "../auth/auth.service";
import { AiService } from "../ai/ai.service";
import { CreateConsultationDto, SendMessageDto } from "../common/dto";
import type { AuthRequest } from "../auth/auth.middleware";
@Controller("consultations")
export class ConsultationsController {
  constructor(
    private readonly db: PrismaService,
    private readonly auth: AuthService,
    private readonly ai: AiService,
  ) {}
  @Post() async create(
    @Req() req: AuthRequest,
    @Body() dto: CreateConsultationDto,
  ) {
    const patient = await this.auth.me(req);
    if (
      dto.doctorId &&
      !(await this.db.doctorAgent.findFirst({
        where: { id: dto.doctorId, isActive: true },
      }))
    )
      throw new BadRequestException("Doctor unavailable");
    return this.db.consultation.create({
      data: { patientId: patient.id, doctorId: dto.doctorId, title: dto.title },
    });
  }
  @Get() async list(@Req() req: AuthRequest) {
     console.log("✅ GET /api/consultations reached NestJS");
    const user = await this.auth.me(req);
    console.log("USER:::: ", user.id)
    return this.db.consultation.findMany({
      where: { patientId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        doctor: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }
  @Get(":id") async one(@Req() req: AuthRequest, @Param("id") id: string) {
    const user = await this.auth.me(req);
    const consultation = await this.db.consultation.findFirst({
      where: { id, patientId: user.id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        doctor: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
    if (!consultation) throw new NotFoundException();
    return consultation;
  }
  @Patch(":id/complete") async complete(
    @Req() req: AuthRequest,
    @Param("id") id: string,
  ) {
    const user = await this.auth.me(req);
    const record = await this.db.consultation.updateMany({
      where: { id, patientId: user.id, status: "ACTIVE" },
      data: { status: "COMPLETED" },
    });
    if (!record.count) throw new NotFoundException();
    return { status: "COMPLETED" };
  }
  @Post(":id/messages")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    }),
  )
  async send(
    @Req() req: AuthRequest,
    @Param("id") id: string,
    @Body() dto: SendMessageDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const user = await this.auth.me(req);
    const consultation = await this.db.consultation.findFirst({
      where: { id, patientId: user.id, status: "ACTIVE" },
    });
    if (!consultation)
      throw new NotFoundException("Active consultation not found");
    if (
      image &&
      !["image/png", "image/jpeg", "image/webp"].includes(image.mimetype)
    )
      throw new BadRequestException("Unsupported image type");
    // No image is stored. Inference runs before messages are persisted.
    const result = await this.ai.respond(
      dto.message,
      consultation.doctorId ?? undefined,
      id,
      image,
    );
    const messages = await this.db.$transaction(async (tx: any) => {
      const patientMessage = await tx.message.create({
        data: {
          consultationId: id,
          role: "PATIENT",
          content: dto.message,
          metadata: image ? { imageAttached: true } : undefined,
        },
      });
      const doctorMessage = await tx.message.create({
        data: { consultationId: id, role: "DOCTOR", content: result.answer },
      });
      await tx.consultation.update({
        where: { id },
        data: {
          status: result.urgency === "emergency" ? "ESCALATED" : "ACTIVE",
          ...(result.doctor_id && !consultation.doctorId ? { doctorId: result.doctor_id } : {}),
        },
      });
      if (result.urgency)
        await tx.triageEvent.create({
          data: {
            consultationId: id,
            urgency: result.urgency,
            specialtySlug: result.specialty_slug,
            needsClarification: !!result.needs_clarification,
            reason: result.reason,
          },
        });
      return { patientMessage, doctorMessage };
    });
    return { ...messages, answer: result.answer, urgency: result.urgency };
  }
}
