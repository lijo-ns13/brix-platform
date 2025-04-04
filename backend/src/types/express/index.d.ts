import userModel, { IUser } from "../../shared/models/user.model";
declare global {
  namespace Express {
    interface Request {
      userId?: any; // Optional shorthand
      user?: any; // Your full user object
    }
  }
}
