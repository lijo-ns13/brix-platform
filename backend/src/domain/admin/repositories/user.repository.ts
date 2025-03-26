import userModel from "../../../shared/models/user.model";

export class UserRepository {
  // Find user by ID
  async findById(userId: string) {
    return userModel.findById(userId);
  }

  // Update user by ID
  async updateUser(userId: string, updateData: any) {
    return userModel.findByIdAndUpdate(userId, updateData, { new: true });
  }

  // Paginate users
  async findUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const users = await userModel.find().skip(skip).limit(limit).exec();
    const totalUsers = await userModel.countDocuments();

    return { users, totalUsers };
  }
}
