import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";
import { TempUserRepository } from "../repositories/TempUser.repository";
import { OTPRepository } from "../repositories/otp.repository";
import { PasswordResetTokenRepository } from "../repositories/PasswordResetToken.repository";
import { EmailService } from "../services/email.service";
import { HTTP_STATUS_CODES } from "../../../shared/constants/httpStatusCode";
import {
  signupRequestSchema,
  signinRequestSchema,
} from "../dtos/user.request.dto";
import { ZodError } from "zod";

export class AuthController {
  private authService: AuthService;

  constructor() {
    const userRepository = new UserRepository();
    const tempUserRepository = new TempUserRepository();
    const otpRepository = new OTPRepository();
    const passwordResetTokenRepository = new PasswordResetTokenRepository();
    const emailService = new EmailService();

    this.authService = new AuthService(
      userRepository,
      tempUserRepository,
      otpRepository,
      passwordResetTokenRepository,
      emailService
    );
  }

  signUp = async (req: Request, res: Response) => {
    try {
      const userDTO = signupRequestSchema.parse(req.body);
      const tempUser = await this.authService.signUp(userDTO);
      res
        .status(HTTP_STATUS_CODES.CREATED)
        .json({ success: true, message: "OTP sent to email", tempUser });
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errObj: Record<string, string> = {};
        error.errors.forEach((err) => {
          errObj[err.path.join(".")] = err.message;
        });
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, errors: errObj });
      } else {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, error: error.message });
      }
    }
  };

  signIn = async (req: Request, res: Response) => {
    try {
      const userDTO = signinRequestSchema.parse(req.body);
      const result = await this.authService.signIn(userDTO);
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
        message: "Sign-in successful",
        user: result.user,
        role: "user",
        isVerified: result.isVerified,
        isBlocked: result.isBlocked,
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
      } else {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, error: error.message });
      }
    }
  };

  verifyOTP = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const result = await this.authService.verifyOTP(email, otp);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: result.message });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  resendOTP = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await this.authService.resendOTP(email);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: result.message });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  forgetPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await this.authService.forgetPassword(email);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Password reset token sent",
        token: result.rawToken,
      });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, password, confirmPassword } = req.body;
      await this.authService.resetPassword(token, password, confirmPassword);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "Password reset successful" });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  logout = async (_req: Request, res: Response) => {
    try {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: error.message });
    }
  };
}
export const authController = new AuthController();
