import { IsBoolean, IsEmail, IsInt, IsNumber, IsObject, IsOptional, IsString, Max, MaxLength, Min, IsIn } from 'class-validator';
export class ProfileDto {
  @IsOptional() @IsString() @MaxLength(120) fullName?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() avatarUrl?: string;
}
export class SpecialistDto {
  @IsString() slug!: string;
  @IsString() name!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
export class DoctorDto {
  @IsString() name!: string;
  @IsString() specialistId!: string;
  @IsString() systemPrompt!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsObject() personality?: Record<string, unknown>;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsOptional() @IsString() modelName?: string;
  @IsOptional() @IsNumber() @Min(0) @Max(1) temperature?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
export class CreateConsultationDto {
  @IsOptional() @IsString() doctorId?: string;
  @IsOptional() @IsString() title?: string;
}
export class SendMessageDto {
  @IsString() @MaxLength(10000) message!: string;
}
export class ReviewDto {
  @IsString() consultationId!: string;
  @IsInt() @Min(1) @Max(5) rating!: number;
  @IsOptional() @IsString() @MaxLength(2000) comment?: string;
}
