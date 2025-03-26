import { Admin } from "../../../shared/models/admin.model";

export class AdminAuthRepository {
  async findByEmail(email: string) {
    return Admin.findOne({ email }).select("+password");
  }
}
