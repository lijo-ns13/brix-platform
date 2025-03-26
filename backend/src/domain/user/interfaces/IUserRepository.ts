import { IUser } from "../../../shared/models/user.model";
export interface IUserRepository {
  findByEmail(email: string, isPassword?: boolean): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  createUser(userData: Partial<IUser>): Promise<IUser>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
}
