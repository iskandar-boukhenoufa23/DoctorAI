"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("./prisma/prisma.service");
const auth_middleware_1 = require("./auth/auth.middleware");
const auth_service_1 = require("./auth/auth.service");
const profile_controller_1 = require("./profile/profile.controller");
const specialists_controller_1 = require("./specialists/specialists.controller");
const doctors_controller_1 = require("./doctors/doctors.controller");
const consultations_controller_1 = require("./consultations/consultations.controller");
const reviews_controller_1 = require("./reviews/reviews.controller");
const internal_controller_1 = require("./internal/internal.controller");
const ai_service_1 = require("./ai/ai.service");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(auth_middleware_1.AuthMiddleware).forRoutes(profile_controller_1.ProfileController, specialists_controller_1.SpecialistsController, doctors_controller_1.DoctorsController, consultations_controller_1.ConsultationsController, reviews_controller_1.ReviewsController);
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({ imports: [config_1.ConfigModule.forRoot({ isGlobal: true })], controllers: [profile_controller_1.ProfileController, specialists_controller_1.SpecialistsController, doctors_controller_1.DoctorsController, consultations_controller_1.ConsultationsController, reviews_controller_1.ReviewsController, internal_controller_1.InternalController], providers: [prisma_service_1.PrismaService, auth_service_1.AuthService, ai_service_1.AiService] })
], AppModule);
//# sourceMappingURL=app.module.js.map