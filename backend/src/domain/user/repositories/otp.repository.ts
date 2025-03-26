// repositories/otp.repository.ts
import { IOTPRepository } from "../interfaces/IOTPRepository"; // Ensure this import is correct
import { Types } from "mongoose"; // Ensure this import is correct
import otpModel, { IOTP } from "../../../shared/models/otp.model";
import { createOtpDTO } from "../interfaces/IOTPRepository";
export class OTPRepository implements IOTPRepository {
  async createOTP(data: createOtpDTO): Promise<IOTP> {
    const otpDoc = new otpModel(data);
    return await otpDoc.save();
  }

  async findOTPByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<IOTP | null> {
    return await otpModel.findOne({ accountId, accountType });
  }

  async updateOTP(
    otpId: Types.ObjectId,
    updateData: Partial<createOtpDTO>
  ): Promise<IOTP | null> {
    return await otpModel.findByIdAndUpdate(otpId, updateData, { new: true });
  }
}
