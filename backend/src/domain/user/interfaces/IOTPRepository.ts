import { IOTP } from "../../../shared/models/otp.model";
import { Types } from "mongoose";

export interface createOtpDTO {
  accountId: Types.ObjectId; // The ID of the user or company
  accountType: "user" | "company"; // The type of account
  otp: string; // The OTP code
  expiresAt: Date; // The expiration date of the OTP
}
export interface IOTPRepository {
  createOTP(data: createOtpDTO): Promise<IOTP>;
  findOTPByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<IOTP | null>;
  updateOTP(
    otpId: Types.ObjectId,
    updateData: Partial<createOtpDTO>
  ): Promise<IOTP | null>;
}
