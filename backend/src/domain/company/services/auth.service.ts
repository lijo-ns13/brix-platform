// auth.service.ts for company
import { CompanyRepository } from "../repositories/company.repositary";
import bcrypt from "bcrypt";
import { JWTService } from "../../../shared/services/jwt.service";
import { OTPRepository } from "../../user/repositories/otp.repository";
import { TempCompanyRepositary } from "../repositories/temp.company.repositary";
import { SignUpCompanyRequestDTO } from "../dtos/auth/company.signup.dto";
import {
  SignInCompanyRequestDTO,
  SignInCompanyResponseDTO,
} from "../dtos/auth/company.signin.dto";
import { generateOTP } from "../../../shared/utils/otp.util";
import { sendOTPEmail } from "../../../shared/utils/email.util";

export class AuthService {
  constructor(
    private companyRepository: CompanyRepository,
    private tempCompanyRepository: TempCompanyRepositary,
    private otpRepository: OTPRepository
  ) {}

  async signUp(payload: SignUpCompanyRequestDTO): Promise<any> {
    const existingCompany = await this.companyRepository.findByEmail(
      payload.email
    );
    const existingTempCompany = await this.tempCompanyRepository.findByEmail(
      payload.email
    );
    if (existingCompany) {
      throw new Error("Email already exists");
    }
    if (existingTempCompany) {
      throw new Error("Too many tries ,try later");
    }
    const tempCompany = await this.tempCompanyRepository.createTempUser(
      payload
    );
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
    await this.otpRepository.createOTP({
      accountId: tempCompany._id,
      accountType: "company",
      otp: otp,
      expiresAt: expiresAt,
    });
    await sendOTPEmail(tempCompany.email, otp);
    return { tempCompany };
  }
  async signIn(
    payload: SignInCompanyRequestDTO
  ): Promise<SignInCompanyResponseDTO> {
    const company = await this.companyRepository.findByEmail(payload.email);
    if (!company) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      company.password
    );
    if (!isPasswordValid) {
      throw new Error("Enter invalid password");
    }
    const companyAccessToken = JWTService.generateAccessToken("company", {
      id: company._id.toString(),
      email: company.email,
      role: "company",
    });
    const companyRefreshToken = JWTService.generateRefreshToken("company", {
      id: company._id.toString(),
      email: company.email,
      role: "company",
    });
    return {
      accessToken: companyAccessToken,
      refreshToken: companyRefreshToken,
      company: company,
      isVerified: company.isVerified,
      isBlocked: company.isBlocked,
    };
  }
  async verifyOTP(
    email: string,
    otp: string
  ): Promise<{ message: string; company: object }> {
    const tempCompany = await this.tempCompanyRepository.findByEmail(email);
    if (!tempCompany) {
      throw new Error("Invalid Company account");
    }
    const otpRecord = await this.otpRepository.findOTPByAccount(
      tempCompany?._id,
      "company"
    );
    if (!otpRecord) {
      throw new Error("Invalid otp enter correct otp");
    }
    if (otpRecord.expiresAt < new Date()) {
      throw new Error("OTP expired");
    }
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);

    if (!isMatch) {
      throw new Error("Invalid OTP");
    }
    const tempCompanyData = {
      companyName: tempCompany.companyName,
      password: tempCompany.password,
      about: tempCompany.about,
      email: tempCompany.email,
      industryType: tempCompany.industryType,
      foundedYear: tempCompany.foundedYear,
      documents: tempCompany.documents,
      location: tempCompany.location,
    };
    const companyData = await this.companyRepository.createCompany(
      tempCompanyData
    );
    return { message: "verfied successfull", company: companyData };
  }
  async resendOTP(email: string): Promise<{ message: string }> {
    const tempCompany = await this.tempCompanyRepository.findByEmail(email);
    if (!tempCompany) throw new Error("User not found or already verified");
    const otpRecord = await this.otpRepository.findOTPByAccount(
      tempCompany._id,
      "company"
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
      await this.otpRepository.updateOTP(otpRecord._id, {
        otp: hashedOTP,
        expiresAt: expiresAt,
      });
    } else {
      // Or create a new one if no existing record
      await this.otpRepository.createOTP({
        accountId: tempCompany._id,
        accountType: "company",
        otp: hashedOTP,
        expiresAt: expiresAt,
      });
    }

    // 7. Send the new OTP via email
    await sendOTPEmail(tempCompany.email, newOTP);

    return { message: "OTP resent successfully. Please check your email." };
  }
}
