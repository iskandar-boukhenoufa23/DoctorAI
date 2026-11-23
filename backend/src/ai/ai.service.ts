import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
@Injectable()
export class AiService {
  private get url() {
    return process.env.AI_SERVICE_URL || "http://localhost:8000";
  }
  private get key() {
    return process.env.AI_SERVICE_KEY || "";
  }
  async respond(
    message: string,
    doctorId?: string,
    consultationId?: string,
    image?: Express.Multer.File,
  ) {
    const form = new FormData();
    form.set("message", message);
    if (doctorId) form.set("doctor_id", doctorId);
    if (consultationId) form.set("consultation_id", consultationId);
    if (image)
      form.set(
        "image",
        new Blob([new Uint8Array(image.buffer)], { type: image.mimetype }),
        image.originalname,
      );
    let response: Response;
    try {
      response = await fetch(`${this.url}/v1/chat`, {
        method: "POST",
        headers: { Authorization: `Bearer ${this.key}` },
        body: form,
        signal: AbortSignal.timeout(45000),
      });
    } catch {
      throw new ServiceUnavailableException("AI service unavailable");
    }
    if (!response.ok)
      throw new BadGatewayException("AI service returned an error");
    const result: unknown = await response.json();
    if (
      !result ||
      typeof result !== "object" ||
      typeof (result as any).answer !== "string"
    )
      throw new BadGatewayException("Unexpected AI response");
    return result as {
      answer: string;
      doctor_id?: string;
      specialty_slug?: string;
      urgency?: string;
      needs_clarification?: boolean;
      reason?: string;
    };
  }
}
