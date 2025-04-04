import { Request, RequestHandler, Response } from "express";
import { AdminAuthRepository } from "../repositories/admin.auth.repository";
import { AdminAuthService } from "../services/auth.service";
import { ZodError } from "zod";
import { HTTP_STATUS_CODES } from "../../../shared/constants/httpStatusCode";
export class AuthController {
  private adminAuthService: AdminAuthService;

  constructor() {
    const adminAuthRepositary = new AdminAuthRepository();
    this.adminAuthService = new AdminAuthService(adminAuthRepositary);
  }
  signIn: RequestHandler = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const result = await this.adminAuthService.signIn(data);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "admin signin successsfully",
        role: "admin",
        user: { name: result.name, email: result.email, id: result.id },
        isVerified: true,
        isBlocked: false,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errObj: Record<string, string> = {};
        error.errors.forEach((err) => {
          errObj[err.path.join(".")] = err.message;
        });
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, errors: errObj });
        return;
      }
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };
}
export const authController = new AuthController();
