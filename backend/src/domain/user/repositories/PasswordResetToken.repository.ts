import { Types } from "mongoose";
import PasswordResetToken, {
  IPasswordResetToken,
} from "../../../shared/models/PasswordResetToken";
import { CreatePasswordResetTokenDto } from "../dtos/forget-password/createPasswordResetToken.dto";

export class PasswordResetTokenRepository {
  async createToken(
    data: CreatePasswordResetTokenDto
  ): Promise<IPasswordResetToken> {
    const tokenDoc = new PasswordResetToken(data);
    return await tokenDoc.save();
  }

  async findByToken(token: string): Promise<IPasswordResetToken | null> {
    return await PasswordResetToken.findOne({ token });
  }

  async findByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<IPasswordResetToken | null> {
    return await PasswordResetToken.findOne({ accountId, accountType });
  }

  async deleteByToken(token: string): Promise<void> {
    await PasswordResetToken.deleteOne({ token });
  }

  async deleteByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<void> {
    await PasswordResetToken.deleteMany({ accountId, accountType });
  }
}
