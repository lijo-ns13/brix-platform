import { SignupRequestDTO, SigninRequestDTO } from "../dtos/user.request.dto";
import {
  SignUpResponseDTO,
  SignInResponseDTO,
} from "../dtos/user.response.dto";
import * as bcrypt from "bcryptjs";
import { JWTService } from "../../../shared/services/jwt.service";
import { IUserRepository } from "../interfaces/IUserRepository";
import { ITempUserRepository } from "../interfaces/ITempUserRepository";
import { IOTPRepository } from "../interfaces/IOTPRepository";
import { IPasswordResetTokenRepository } from "../interfaces/IPasswordResetTokenRepository";
import { IEmailService } from "../interfaces/IEmailService";
import { generateOTP } from "../../../shared/utils/otp.util";
import { generatePasswordResetToken } from "../../../shared/utils/generatePasswordResetToken ";
import crypto from "crypto";

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private tempUserRepository: ITempUserRepository,
    private otpRepository: IOTPRepository,
    private passwordResetTokenRepository: IPasswordResetTokenRepository,
    private emailService: IEmailService
  ) {}

  async signUp(payload: SignupRequestDTO): Promise<SignUpResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(payload.email);
    const existingTempUser = await this.tempUserRepository.findByEmail(
      payload.email
    );

    if (existingUser) throw new Error("Email already exists");
    if (existingTempUser)
      throw new Error("You tried too many times. Please try again later.");

    const tempUser = await this.tempUserRepository.createTempUser({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minute

    await this.otpRepository.createOTP({
      accountId: tempUser._id,
      accountType: "user",
      otp: otp,
      expiresAt: expiresAt,
    });

    await this.emailService.sendOTP(tempUser.email, otp);

    return {
      id: tempUser._id.toString(),
      name: tempUser.name,
      email: tempUser.email,
      isVerified: tempUser.isVerified,
      expiresAt: tempUser.expiresAt,
    };
  }

  async signIn(payload: SigninRequestDTO): Promise<SignInResponseDTO> {
    const user = await this.userRepository.findByEmail(payload.email, true);
    if (!user) throw new Error("User not found");
    if (!user.password) {
      throw new Error("Google signin users dont have");
    }
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password
    );
    if (!isPasswordValid) throw new Error("Invalid password");

    const userAccessToken = JWTService.generateAccessToken("user", {
      id: user._id.toString(),
      email: user.email,
      role: "user",
    });

    const userRefreshToken = JWTService.generateRefreshToken("user", {
      id: user._id.toString(),
      email: user.email,
      role: "user",
    });

    return {
      accessToken: userAccessToken,
      refreshToken: userRefreshToken,
      user: { name: user.name, email: user.email, id: user._id },
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
    };
  }

  async verifyOTP(email: string, otp: string) {
    const tempUser = await this.tempUserRepository.findByEmail(email);
    if (!tempUser) throw new Error("User not found or already verified");

    const otpRecord = await this.otpRepository.findOTPByAccount(
      tempUser._id,
      "user"
    );
    if (!otpRecord) throw new Error("OTP not found");
    if (otpRecord.expiresAt < new Date()) throw new Error("OTP expired");

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) throw new Error("Invalid OTP");

    await this.userRepository.createUser({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
    });

    return { message: "User verified successfully" };
  }

  async resendOTP(email: string): Promise<{ message: string }> {
    const tempUser = await this.tempUserRepository.findByEmail(email);
    if (!tempUser) throw new Error("User not found or already verified");

    const otpRecord = await this.otpRepository.findOTPByAccount(
      tempUser._id,
      "user"
    );

    const newOTP = generateOTP();
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minute

    const hashedOTP = await bcrypt.hash(newOTP, 10);

    if (otpRecord) {
      await this.otpRepository.updateOTP(otpRecord._id, {
        otp: hashedOTP,
        expiresAt: expiresAt,
      });
    } else {
      await this.otpRepository.createOTP({
        accountId: tempUser._id,
        accountType: "user",
        otp: hashedOTP,
        expiresAt: expiresAt,
      });
    }

    await this.emailService.sendOTP(tempUser.email, newOTP);

    return { message: "OTP resent successfully. Please check your email." };
  }

  async forgetPassword(email: string): Promise<{ rawToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const userId = user._id;

    await this.passwordResetTokenRepository.deleteByAccount(userId, "user");

    const { rawToken, hashedToken, expiresAt } = generatePasswordResetToken();

    await this.passwordResetTokenRepository.createToken({
      token: hashedToken,
      accountId: userId,
      accountType: "user",
      expiresAt,
    });

    await this.emailService.sendPasswordResetEmail(user.email, rawToken);

    return { rawToken };
  }

  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    if (password !== confirmPassword) throw new Error("Passwords do not match");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const tokenDoc = await this.passwordResetTokenRepository.findByToken(
      hashedToken
    );
    if (!tokenDoc || tokenDoc.expiresAt < new Date())
      throw new Error("Token is invalid or has expired");

    const { accountId, accountType } = tokenDoc;
    if (accountType !== "user")
      throw new Error("Invalid account type for this operation");

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.updatePassword(
      accountId.toString(),
      hashedPassword
    );

    await this.passwordResetTokenRepository.deleteByAccount(
      accountId,
      accountType
    );
  }
}
