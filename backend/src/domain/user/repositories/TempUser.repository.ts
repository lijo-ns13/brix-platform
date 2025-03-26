import tempUserModel, {
  ITempUser,
} from "../../../shared/models/temp.user.model";
export interface createTempUserDTO {
  name: string;
  email: string;
  password: string;
}
import { ITempUserRepository } from "../interfaces/ITempUserRepository";

export class TempUserRepository implements ITempUserRepository {
  async findByEmail(email: string): Promise<ITempUser | null> {
    return tempUserModel.findOne({ email }).select("+password");
  }

  async findById(id: string): Promise<ITempUser | null> {
    return tempUserModel.findById(id);
  }

  async createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser> {
    const tempUser = new tempUserModel(tempUserData);
    return tempUser.save();
  }
}
