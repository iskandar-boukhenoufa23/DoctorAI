"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const backend_1 = require("@clerk/backend");
let AuthMiddleware = class AuthMiddleware {
    async use(req, _res, next) {
        const match = /^Bearer (.+)$/i.exec(req.headers.authorization ?? "");
        if (!match)
            throw new common_1.UnauthorizedException("Bearer token required");
        const secretKey = process.env.CLERK_SECRET_KEY;
        if (!secretKey)
            throw new common_1.UnauthorizedException("Clerk server configuration missing");
        try {
            const claims = await (0, backend_1.verifyToken)(match[1], { secretKey });
            if (!claims.sub)
                throw new Error("No subject");
            req.clerkUserId = claims.sub;
            next();
        }
        catch {
            throw new common_1.UnauthorizedException("Invalid Clerk token");
        }
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = __decorate([
    (0, common_1.Injectable)()
], AuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map