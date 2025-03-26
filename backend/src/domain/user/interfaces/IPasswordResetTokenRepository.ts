import { IPasswordResetToken } from "../../../shared/models/PasswordResetToken";
import { Types } from "mongoose";
import { CreatePasswordResetTokenDto } from "../dtos/forget-password/createPasswordResetToken.dto";

export interface IPasswordResetTokenRepository {
  createToken(data: CreatePasswordResetTokenDto): Promise<IPasswordResetToken>;
  findByToken(token: string): Promise<IPasswordResetToken | null>;
  findByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<IPasswordResetToken | null>;
  deleteByToken(token: string): Promise<void>;
  deleteByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<void>;
}
