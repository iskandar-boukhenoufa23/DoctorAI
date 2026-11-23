"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
let AiService = class AiService {
    get url() {
        return process.env.AI_SERVICE_URL || "http://localhost:8000";
    }
    get key() {
        return process.env.AI_SERVICE_KEY || "";
    }
    async respond(message, doctorId, consultationId, image) {
        const form = new FormData();
        form.set("message", message);
        if (doctorId)
            form.set("doctor_id", doctorId);
        if (consultationId)
            form.set("consultation_id", consultationId);
        if (image)
            form.set("image", new Blob([new Uint8Array(image.buffer)], { type: image.mimetype }), image.originalname);
        let response;
        try {
            response = await fetch(`${this.url}/v1/chat`, {
                method: "POST",
                headers: { Authorization: `Bearer ${this.key}` },
                body: form,
                signal: AbortSignal.timeout(45000),
            });
        }
        catch {
            throw new common_1.ServiceUnavailableException("AI service unavailable");
        }
        if (!response.ok)
            throw new common_1.BadGatewayException("AI service returned an error");
        const result = await response.json();
        if (!result ||
            typeof result !== "object" ||
            typeof result.answer !== "string")
            throw new common_1.BadGatewayException("Unexpected AI response");
        return result;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)()
], AiService);
//# sourceMappingURL=ai.service.js.map