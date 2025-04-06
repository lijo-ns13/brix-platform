// src/types/express/index.d.ts
export interface IUser {
  id: string;
  email: string;
  role: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
export {};
