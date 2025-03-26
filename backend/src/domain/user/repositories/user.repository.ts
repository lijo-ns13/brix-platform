import userModel, { IUser } from "../../../shared/models/user.model";
import { IUserRepository } from "../interfaces/IUserRepository";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string, isPassword = false): Promise<IUser | null> {
    if (isPassword) {
      return userModel.findOne({ email }).select("+password");
    }
    return userModel.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return userModel.findById(id);
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new userModel(userData);
    return user.save();
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await userModel.findByIdAndUpdate(userId, { password: newPassword });
  }
  async findByGoogleId(googleId: string) {
    return userModel.findOne({ googleId });
  }
}
