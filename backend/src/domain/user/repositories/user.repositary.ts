import userModel, { IUser } from "../../../shared/models/user.model";

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return userModel.findOne({ email }).select("+password");
  }
  async findById(id: string): Promise<IUser | null> {
    return userModel.findById(id);
  }
  async createUser(userData: any): Promise<IUser> {
    const user = new userModel(userData);
    return user.save();
  }
  async updatePassword(accountId: string, newPassword: string): Promise<void> {
    await userModel.findByIdAndUpdate(accountId, { password: newPassword });
  }
}
