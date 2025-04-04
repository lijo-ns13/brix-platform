// src/types/express.d.ts
import { IUser } from "../../shared/models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
