import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: (process.env.CORS_ORIGIN || "http://localhost:3000")
      .split(",")
      .map((origin) => origin.trim()),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  console.log("PORT::::::::::: ", process.env.PORT);
  await app.listen(Number(process.env.PORT || 3000), "0.0.0.0");
}
void bootstrap();
