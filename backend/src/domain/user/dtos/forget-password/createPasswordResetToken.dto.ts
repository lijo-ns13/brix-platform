import { Types } from "mongoose";

export interface CreatePasswordResetTokenDto {
  token: string;
  accountId: Types.ObjectId;
  accountType: "user" | "company";
  expiresAt: Date;
}
