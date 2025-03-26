import { ITempUser } from "../../../shared/models/temp.user.model";

export interface ITempUserRepository {
  findByEmail(email: string): Promise<ITempUser | null>;
  findById(id: string): Promise<ITempUser | null>;
  createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser>;
}
