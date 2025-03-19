import { Types } from "mongoose";
import otpModel , { IOTP} from "../../../shared/models/otp.model";

interface createOtpDTO {
    accountId:Types.ObjectId;
    accountType:'user'|'company';
    otp:string;
    expiresAt:Date;
}

export class OTPRepositary {
    async createOTP (data:createOtpDTO): Promise<IOTP> {
        try {
            const otpDoc=new otpModel(data);
            await otpDoc.save();
            return otpDoc;
        } catch (error) {
            console.log('error in creating otp',error);
            throw new Error('Failed to create OTP')
        }
    }
    async findOTPByAccount(accountId:Types.ObjectId,accountType:'user'|'company'): Promise<IOTP | null>{
        return await otpModel.findOne({accountId,accountType})
    }
    async updateOTP(otpId: Types.ObjectId, updateData: Partial<createOtpDTO>): Promise<IOTP | null> {
        try {
          const updatedOTP = await otpModel.findByIdAndUpdate(
            otpId,
            { ...updateData, updatedAt: new Date() }, // explicitly updating updatedAt
            { new: true } // return the updated document
          );
          return updatedOTP;
        } catch (error) {
          console.log('error in updating otp', error);
          throw new Error('Failed to update OTP');
        }
      }
}

