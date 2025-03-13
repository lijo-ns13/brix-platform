import { ObjectId } from "mongoose";

export interface UserResponseDTO {
    id: ObjectId;
    name: string;
    email: string;
    isVerified:boolean;
  }

export interface SignInResponseDTO {
  accessToken:string;
  refreshToken:string;
  user:object
}