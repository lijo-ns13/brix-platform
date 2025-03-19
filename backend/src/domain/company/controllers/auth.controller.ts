// auth.controller.ts =>company side

import { Request, RequestHandler, Response } from "express";
import { AuthService } from "../services/auth.service";
import { CompanyRepository } from "../repositories/company.repositary";
import { ZodError } from "zod";
import { signUpCompanyRequestSchema } from "../dtos/auth/company.signup.dto";
import { signInCompanyRequestSchema } from "../dtos/auth/company.signin.dto";
import { TempCompanyRepositary } from "../repositories/temp.company.repositary";
import { OTPRepositary } from "../../user/repositories/otp.repository";
export class AuthController {
  private authService: AuthService;

  constructor() {
    const companyRepository = new CompanyRepository();
    const companyTempRepository = new TempCompanyRepositary();
    const otpRepository = new OTPRepositary();
    this.authService = new AuthService(
      companyRepository,
      companyTempRepository,
      otpRepository
    );
  }

  signUp: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const parsed = signUpCompanyRequestSchema.parse(req.body);
      if (!parsed) {
        res.status(400).json({ success: false, message: "missing fields" });
        return;
      }
      const tempCompany = await this.authService.signUp(parsed);
      res.status(201).json({
        success: true,
        message: "otp sent to email successfully",
        tempCompany,
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

  signIn: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const parsed = signInCompanyRequestSchema.parse(req.body);
    const result = await this.authService.signIn(parsed);
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true, // prevents JS access (important!)
      secure: process.env.NODE_ENV === "production", // send over HTTPS in prod
      sameSite: "lax", // prevents CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // cookie lifetime in ms
    });
    res.status(200).json({
      success: true,
      accessToken: result.accessToken,
      role: "company",
      company: result.company,
    });
  };
  verify: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email, otp } = req.body;
      const result = await this.authService.verifyOTP(email, otp);
      res.status(201).json({
        success: true,
        message: "otp verified successfully",
        company: result.company,
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
  resend = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await this.authService.resendOTP(email);
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
}
export const authController = new AuthController();
