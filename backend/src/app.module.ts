import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthService } from './auth/auth.service';
import { ProfileController } from './profile/profile.controller';
import { SpecialistsController } from './specialists/specialists.controller';
import { DoctorsController } from './doctors/doctors.controller';
import { ConsultationsController } from './consultations/consultations.controller';
import { ReviewsController } from './reviews/reviews.controller';
import { InternalController } from './internal/internal.controller';
import { AiService } from './ai/ai.service';
@Module({ imports: [ConfigModule.forRoot({ isGlobal: true })], controllers: [ProfileController, SpecialistsController, DoctorsController, ConsultationsController, ReviewsController, InternalController], providers: [PrismaService, AuthService, AiService] })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ProfileController, SpecialistsController, DoctorsController, ConsultationsController, ReviewsController);
  }
}
