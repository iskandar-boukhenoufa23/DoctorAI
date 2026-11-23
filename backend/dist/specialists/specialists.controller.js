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
exports.SpecialistsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
const dto_1 = require("../common/dto");
let SpecialistsController = class SpecialistsController {
    db;
    auth;
    constructor(db, auth) {
        this.db = db;
        this.auth = auth;
    }
    list() {
        return this.db.specialist.findMany({
            where: { isActive: true },
            include: { _count: { select: { doctors: true } } },
        });
    }
    one(id) {
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
    async create(req, dto) {
        await this.auth.admin(req);
        return this.db.specialist.create({ data: dto });
    }
    async update(req, id, dto) {
        await this.auth.admin(req);
        return this.db.specialist.update({ where: { id }, data: dto });
    }
    async disable(req, id) {
        await this.auth.admin(req);
        return this.db.specialist.update({
            where: { id },
            data: { isActive: false },
        });
    }
};
exports.SpecialistsController = SpecialistsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SpecialistsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpecialistsController.prototype, "one", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.SpecialistDto]),
    __metadata("design:returntype", Promise)
], SpecialistsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SpecialistsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SpecialistsController.prototype, "disable", null);
exports.SpecialistsController = SpecialistsController = __decorate([
    (0, common_1.Controller)("specialists"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], SpecialistsController);
//# sourceMappingURL=specialists.controller.js.map