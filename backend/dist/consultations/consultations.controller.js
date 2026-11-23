"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
const ai_service_1 = require("../ai/ai.service");
const dto_1 = require("../common/dto");
let ConsultationsController = class ConsultationsController {
    db;
    auth;
    ai;
    constructor(db, auth, ai) {
        this.db = db;
        this.auth = auth;
        this.ai = ai;
    }
    async create(req, dto) {
        const patient = await this.auth.me(req);
        if (dto.doctorId &&
            !(await this.db.doctorAgent.findFirst({
                where: { id: dto.doctorId, isActive: true },
            })))
            throw new common_1.BadRequestException("Doctor unavailable");
        return this.db.consultation.create({
            data: { patientId: patient.id, doctorId: dto.doctorId, title: dto.title },
        });
    }
    async list(req) {
        console.log("✅ GET /api/consultations reached NestJS");
        const user = await this.auth.me(req);
        console.log("USER:::: ", user.id);
        return this.db.consultation.findMany({
            where: { patientId: user.id },
            orderBy: { createdAt: "desc" },
            include: {
                doctor: { select: { id: true, name: true, avatarUrl: true } },
            },
        });
    }
    async one(req, id) {
        const user = await this.auth.me(req);
        const consultation = await this.db.consultation.findFirst({
            where: { id, patientId: user.id },
            include: {
                messages: { orderBy: { createdAt: "asc" } },
                doctor: { select: { id: true, name: true, avatarUrl: true } },
            },
        });
        if (!consultation)
            throw new common_1.NotFoundException();
        return consultation;
    }
    async complete(req, id) {
        const user = await this.auth.me(req);
        const record = await this.db.consultation.updateMany({
            where: { id, patientId: user.id, status: "ACTIVE" },
            data: { status: "COMPLETED" },
        });
        if (!record.count)
            throw new common_1.NotFoundException();
        return { status: "COMPLETED" };
    }
    async send(req, id, dto, image) {
        const user = await this.auth.me(req);
        const consultation = await this.db.consultation.findFirst({
            where: { id, patientId: user.id, status: "ACTIVE" },
        });
        if (!consultation)
            throw new common_1.NotFoundException("Active consultation not found");
        if (image &&
            !["image/png", "image/jpeg", "image/webp"].includes(image.mimetype))
            throw new common_1.BadRequestException("Unsupported image type");
        // No image is stored. Inference runs before messages are persisted.
        const result = await this.ai.respond(dto.message, consultation.doctorId ?? undefined, id, image);
        const messages = await this.db.$transaction(async (tx) => {
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
};
exports.ConsultationsController = ConsultationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateConsultationDto]),
    __metadata("design:returntype", Promise)
], ConsultationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsultationsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ConsultationsController.prototype, "one", null);
__decorate([
    (0, common_1.Patch)(":id/complete"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ConsultationsController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(":id/messages"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("image", {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ConsultationsController.prototype, "send", null);
exports.ConsultationsController = ConsultationsController = __decorate([
    (0, common_1.Controller)("consultations"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService,
        ai_service_1.AiService])
], ConsultationsController);
//# sourceMappingURL=consultations.controller.js.map