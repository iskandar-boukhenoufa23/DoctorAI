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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewDto = exports.SendMessageDto = exports.CreateConsultationDto = exports.DoctorDto = exports.SpecialistDto = exports.ProfileDto = void 0;
const class_validator_1 = require("class-validator");
class ProfileDto {
    fullName;
    email;
    avatarUrl;
}
exports.ProfileDto = ProfileDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], ProfileDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ProfileDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProfileDto.prototype, "avatarUrl", void 0);
class SpecialistDto {
    slug;
    name;
    description;
    isActive;
}
exports.SpecialistDto = SpecialistDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SpecialistDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SpecialistDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SpecialistDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SpecialistDto.prototype, "isActive", void 0);
class DoctorDto {
    name;
    specialistId;
    systemPrompt;
    description;
    personality;
    avatarUrl;
    modelName;
    temperature;
    isActive;
}
exports.DoctorDto = DoctorDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DoctorDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DoctorDto.prototype, "specialistId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DoctorDto.prototype, "systemPrompt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DoctorDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], DoctorDto.prototype, "personality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DoctorDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DoctorDto.prototype, "modelName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], DoctorDto.prototype, "temperature", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DoctorDto.prototype, "isActive", void 0);
class CreateConsultationDto {
    doctorId;
    title;
}
exports.CreateConsultationDto = CreateConsultationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "title", void 0);
class SendMessageDto {
    message;
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", String)
], SendMessageDto.prototype, "message", void 0);
class ReviewDto {
    consultationId;
    rating;
    comment;
}
exports.ReviewDto = ReviewDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReviewDto.prototype, "consultationId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], ReviewDto.prototype, "rating", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], ReviewDto.prototype, "comment", void 0);
//# sourceMappingURL=dto.js.map