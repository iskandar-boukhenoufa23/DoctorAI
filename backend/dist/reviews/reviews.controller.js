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
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
const dto_1 = require("../common/dto");
let ReviewsController = class ReviewsController {
    db;
    auth;
    constructor(db, auth) {
        this.db = db;
        this.auth = auth;
    }
    list(doctorId) { return this.db.doctorReview.findMany({ where: { doctorId }, select: { id: true, rating: true, comment: true, createdAt: true }, orderBy: { createdAt: 'desc' } }); }
    async create(req, dto) {
        const user = await this.auth.me(req);
        const consultation = await this.db.consultation.findFirst({ where: { id: dto.consultationId, patientId: user.id, status: 'COMPLETED' } });
        if (!consultation?.doctorId)
            throw new common_1.BadRequestException('Completed doctor consultation required');
        return this.db.doctorReview.create({ data: { patientId: user.id, doctorId: consultation.doctorId, consultationId: consultation.id, rating: dto.rating, comment: dto.comment } });
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Get)('doctor/:doctorId'),
    __param(0, (0, common_1.Param)('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.ReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "create", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, auth_service_1.AuthService])
], ReviewsController);
//# sourceMappingURL=reviews.controller.js.map