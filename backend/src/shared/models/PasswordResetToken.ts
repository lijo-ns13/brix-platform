import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPasswordResetToken extends Document {
  _id: Types.ObjectId;
  token: string;
  accountId: Types.ObjectId;
  accountType: "user" | "company";
  expiresAt: Date;
}

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>({
  token: {
    type: String,
    required: true,
  },
  accountId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["user", "company"],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index to automatically delete expired tokens
  },
});

export default mongoose.model<IPasswordResetToken>(
  "PasswordResetToken",
  PasswordResetTokenSchema
);
