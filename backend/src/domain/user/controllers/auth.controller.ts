// authcontrller.ts

import { Request, RequestHandler, Response } from "express";
// repositories
import { UserRepository } from "../repositories/user.repositary";
import { TempUserRepositary } from "../repositories/TempUser.repositary";
import { OTPRepositary } from "../repositories/otp.repository";
import { PasswordResetTokenRepository } from "../repositories/passwordResetToken.repository";
// services
import { UserService } from "../services/auth.service";

import {
  signupRequestSchema,
  signinRequestSchema,
} from "../dtos/user.request.dto";
import { ZodError } from "zod";

export class UserController {
  private userService: UserService;

  constructor() {
    const userRepository = new UserRepository();
    const tempuserRepositary = new TempUserRepositary();
    const otpRepositary = new OTPRepositary();
    const passwordResetTokenRepository = new PasswordResetTokenRepository();
    this.userService = new UserService(
      userRepository,
      tempuserRepositary,
      otpRepositary,
      passwordResetTokenRepository
    );
  }

  signUp: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userDTO = signupRequestSchema.parse(req.body);

      const tempUser = await this.userService.signUp(userDTO);
      res.status(201).json({
        success: true,
        message: "otp sent to email successfully ",
        tempUser,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errObj: Record<string, string> = {};
        error.errors.forEach((err) => {
          errObj[err.path.join(".")] = err.message;
        });
        res.status(400).json({ success: false, errors: errObj });
        return;
      }
      res.status(400).json({ success: false, error: error.message });
    }
  };

  signIn = async (req: Request, res: Response) => {
    try {
      const userDTO = signinRequestSchema.parse(req.body);
      const result = await this.userService.signIn(userDTO);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true, // prevents JS access (important!)
        secure: process.env.NODE_ENV === "production", // send over HTTPS in prod
        sameSite: "lax", // prevents CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // cookie lifetime in ms
      });

      res.status(200).json({
        success: true,
        message: "signin successfully",
        accessToken: result.accessToken,
        user: result.user,
        role: "user",
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errObj: Record<string, string> = {};
        error.errors.forEach((err) => {
          errObj[err.path.join(".")] = err.message;
        });
        res.status(400).json({ success: false, errors: errObj });
      }
      res.status(400).json({ error: error.message });
    }
  };
  verify = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const result = await this.userService.verifyOTP(email, otp);
      res.status(201).json({ success: true, result: result });
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errObj: Record<string, string> = {};
        error.errors.forEach((err) => {
          errObj[err.path.join(".")] = err.message;
        });
        res.status(400).json({ success: false, errors: errObj });
      }
      res.status(400).json({ error: error.message });
    }
  };
  resend = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await this.userService.resendOTP(email);
      res.status(201).json({ success: true, result: result });
    } catch (error) {
      if (error instanceof ZodError) {
        const errObj: Record<string, string> = {};
        error.errors.forEach((err) => {
          errObj[err.path.join(".")] = err.message;
        });
        res.status(400).json({ success: false, errors: errObj });
      }
    }
  };
  logout = async (_req: Request, res: Response) => {
    try {
      res.clearCookie("refreshToken");
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  forgetPassword: RequestHandler = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ success: false, error: "Email is required" });
        return;
      }

      const result = await this.userService.forgetPassword(email);

      res.status(200).json({
        success: true,
        message: "Password reset token has been sent to your email.",
        token: result.rawToken,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  resetPassword: RequestHandler = async (req, res) => {
    try {
      const { token, password, confirmPassword } = req.body;

      if (!token || !password || !confirmPassword) {
        res.status(400).json({
          success: false,
          error: "Token, password, and confirmPassword are required.",
        });
        return;
      }

      await this.userService.resetPassword(token, password, confirmPassword);

      res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
export const userController = new UserController();
