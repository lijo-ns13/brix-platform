// authservice
import { UserRepository } from "../repositories/user.repositary";
import { TempUserRepositary } from "../repositories/TempUser.repositary";
import { OTPRepositary } from "../repositories/otp.repository";
import { PasswordResetTokenRepository } from "../repositories/passwordResetToken.repository";
import { SignupRequestDTO, SigninRequestDTO } from "../dtos/user.request.dto";
import { sendPasswordResetEmail } from "../../../shared/utils/forget.email.util";
import {
  SignUpResponseDTO,
  SignInResponseDTO,
} from "../dtos/user.response.dto";
import crypto from "crypto";
import { generatePasswordResetToken } from "../../../shared/utils/generatePasswordResetToken ";
import { generateOTP } from "../../../shared/utils/otp.util";
import { sendOTPEmail } from "../../../shared/utils/email.util";
import * as bcrypt from "bcryptjs";
import { JWTService } from "../../../shared/services/jwt.service";
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private tempuserRepositary: TempUserRepositary,
    private otpRepositary: OTPRepositary,
    private passwordResetTokenRepository: PasswordResetTokenRepository
  ) {}

  async signUp(payload: SignupRequestDTO): Promise<SignUpResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(payload.email);
    const existingTempUser = await this.tempuserRepositary.findByEmail(
      payload.email
    );
    if (existingUser) {
      throw new Error("Email already exists");
    }
    if (existingTempUser) {
      throw new Error("You tried lots,do later after 10 min");
    }
    const tempUser = await this.tempuserRepositary.createTempUser({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 mins
    await this.otpRepositary.createOTP({
      accountId: tempUser._id,
      accountType: "user",
      otp: otp,
      expiresAt: expiresAt,
    });
    await sendOTPEmail(tempUser.email, otp);

    return {
      id: tempUser._id.toString(),
      name: tempUser.name,
      email: tempUser.email,
      isVerified: tempUser.isVerified,
      expiresAt: tempUser.expiresAt,
    };
  }

  async signIn(payload: SigninRequestDTO): Promise<SignInResponseDTO> {
    const user = await this.userRepository.findByEmail(payload.email);
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Wrong password,Enter correct password");
    }
    // token generation
    const userAccessToken = JWTService.generateAccessToken("user", {
      id: user._id.toString(),
      email: user.email,
    });
    const userRefreshToken = JWTService.generateRefreshToken("user", {
      id: user._id.toString(),
      email: user.email,
    });
    console.log(userAccessToken, typeof userAccessToken, "accesstoken");
    return {
      accessToken: userAccessToken,
      refreshToken: userRefreshToken,
      user: { name: user.name, email: user.email },
    };
  }
  async verifyOTP(email: string, otp: string) {
    const tempUser = await this.tempuserRepositary.findByEmail(email);
    if (!tempUser) throw new Error("User not found or already verified");
    const otpRecord = await this.otpRepositary.findOTPByAccount(
      tempUser._id,
      "user"
    );
    if (!otpRecord) throw new Error("OTP is not found");
    if (otpRecord.expiresAt < new Date()) {
      throw new Error("OTP expired");
    }
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);

    if (!isMatch) {
      throw new Error("Invalid OTP");
    }
    await this.userRepository.createUser({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
    });
    return { message: "User verified successfully" };
  }
  async resendOTP(email: string): Promise<{ message: string }> {
    const tempUser = await this.tempuserRepositary.findByEmail(email);
    if (!tempUser) throw new Error("User not found or already verified");
    const otpRecord = await this.otpRepositary.findOTPByAccount(
      tempUser._id,
      "user"
    );

    // 3. Rate-limit: if OTP exists and was generated recently, deny resend
    // if (otpRecord) {
    //   const timeSinceLastOTP = Date.now() - otpRecord.updatedAt.getTime();
    //   const resendCooldown = 60 * 1000; // 1 min cooldown
    //   if (timeSinceLastOTP < resendCooldown) {
    //     const waitTimeInSeconds = Math.ceil((resendCooldown - timeSinceLastOTP) / 1000);
    //     throw new Error(`Please wait ${waitTimeInSeconds} seconds before resending OTP.`);
    //   }
    // }

    // 4. Generate new OTP
    const newOTP = generateOTP();
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 3 mins expiry

    // 5. Hash the OTP before saving it (security best practice)
    const hashedOTP = await bcrypt.hash(newOTP, 10);

    if (otpRecord) {
      // 6. Update the existing OTP record with new OTP and expiry
      await this.otpRepositary.updateOTP(otpRecord._id, {
        otp: hashedOTP,
        expiresAt: expiresAt,
      });
    } else {
      // Or create a new one if no existing record
      await this.otpRepositary.createOTP({
        accountId: tempUser._id,
        accountType: "user",
        otp: hashedOTP,
        expiresAt: expiresAt,
      });
    }

    // 7. Send the new OTP via email
    await sendOTPEmail(tempUser.email, newOTP);

    return { message: "OTP resent successfully. Please check your email." };
  }
  //

  //
  async forgetPassword(email: string): Promise<{ rawToken: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const userId = user._id;

    await this.passwordResetTokenRepository.deleteByAccount(userId, "user");

    const { rawToken, hashedToken, expiresAt } = generatePasswordResetToken();

    await this.passwordResetTokenRepository.createToken({
      token: hashedToken,
      accountId: userId,
      accountType: "user",
      expiresAt,
    });

    await sendPasswordResetEmail(user.email, rawToken);

    console.log(`Reset Token (Dev Only): ${rawToken}`);
    return { rawToken };
  }
  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const tokenDoc = await this.passwordResetTokenRepository.findByToken(
      hashedToken
    );

    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      throw new Error("Token is invalid or has expired");
    }

    const { accountId, accountType } = tokenDoc;

    if (accountType !== "user") {
      throw new Error("Invalid account type for this operation");
    }

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
