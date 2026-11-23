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
exports.DoctorsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
const dto_1 = require("../common/dto");
const publicDoctor = { id: true, name: true, description: true, avatarUrl: true, isActive: true, specialist: { select: { id: true, name: true, slug: true } }, reviews: { select: { rating: true } } };
let DoctorsController = class DoctorsController {
    db;
    auth;
    constructor(db, auth) {
        this.db = db;
        this.auth = auth;
    }
    list(specialty) { return this.db.doctorAgent.findMany({ where: { isActive: true, specialist: { isActive: true, ...(specialty ? { slug: specialty } : {}) } }, select: publicDoctor }); }
    one(id) { return this.db.doctorAgent.findFirstOrThrow({ where: { id, isActive: true }, select: publicDoctor }); }
    async create(req, dto) { await this.auth.admin(req); return this.db.doctorAgent.create({ data: { ...dto, personality: dto.personality } }); }
    async update(req, id, dto) { await this.auth.admin(req); return this.db.doctorAgent.update({ where: { id }, data: { ...dto, personality: dto.personality, promptVersion: { increment: 1 } } }); }
    async disable(req, id) { await this.auth.admin(req); return this.db.doctorAgent.update({ where: { id }, data: { isActive: false } }); }
};
exports.DoctorsController = DoctorsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('specialty')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "one", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.DoctorDto]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "disable", null);
exports.DoctorsController = DoctorsController = __decorate([
    (0, common_1.Controller)('doctors'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, auth_service_1.AuthService])
], DoctorsController);
//# sourceMappingURL=doctors.controller.js.map