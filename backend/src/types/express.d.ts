interface IUser {
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

export {}; // ← important to mark this as a module
