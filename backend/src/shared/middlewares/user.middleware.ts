import { Request, Response, NextFunction } from "express";
import { JWTService } from "../services/jwt.service";
import { HTTP_STATUS_CODES } from "../constants/httpStatusCode";

interface AuthenticatedUser {
  id: string;
  email: string;
  role: "user";
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: "Unauthorized: No access token" });
      return;
    }

    const decodedAccess = JWTService.verifyAccessToken("user", accessToken);

    if (!decodedAccess) {
      res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: "Unauthorized: Invalid access token" });
      return;
    }

    // ✅ Set `req.user` so controllers can access it
    req.user = {
      id: decodedAccess.id,
      email: decodedAccess.email,
      role: "user",
    };

    next();
  } catch (error) {
    console.error("User Auth Middleware Error:", error);
    res
      .status(HTTP_STATUS_CODES.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }
};
