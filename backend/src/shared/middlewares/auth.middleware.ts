// import { Request, Response, NextFunction } from "express";
// import { JWTService } from "../services/jwt.service";
// import { HTTP_STATUS_CODES } from "../constants/httpStatusCode";
// interface AuthenticatedRequest extends Request {
//   user?: any;
// }

// export const authenticate = (role: "user" | "admin" | "company") => {
//   return async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const accessToken = req.cookies.accessToken;
//       const refreshToken = req.cookies.refreshToken;
//       console.log("accesstoken", accessToken);
//       console.log("refreshtoken", refreshToken);
//       if (!accessToken) {
//         res
//           .status(HTTP_STATUS_CODES.UNAUTHORIZED)
//           .json({ message: "Unauthorized: No access token" });
//         return; // ❗ Stop execution after response
//       }

//       let decodedAccess = JWTService.verifyAccessToken(role, accessToken);

//       if (!decodedAccess) {
//         console.log("Access token invalid/expired. Trying refresh token...");

//         if (!refreshToken) {
//           res
//             .status(HTTP_STATUS_CODES.UNAUTHORIZED)
//             .json({ message: "Unauthorized: No refresh token" });
//           return;
//         }

//         const decodedRefresh = JWTService.verifyRefreshToken(
//           role,
//           refreshToken
//         );

//         if (!decodedRefresh) {
//           res
//             .status(HTTP_STATUS_CODES.UNAUTHORIZED)
//             .json({ message: "Unauthorized: Invalid refresh token" });
//           return;
//         }

//         const payload = {
//           id: decodedRefresh.id,
//           email: decodedRefresh.email,
//           role: decodedRefresh.role,
//         };

//         const newAccessToken = JWTService.generateAccessToken(role, payload);

//         res.cookie("accessToken", newAccessToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: "strict",
//           maxAge: 60 * 60 * 1000, // 1 hour
//         });

//         decodedAccess = JWTService.verifyAccessToken(role, newAccessToken);
//       }

//       next();
//     } catch (error) {
//       console.error("Auth Middleware Error:", error);
//       res
//         .status(HTTP_STATUS_CODES.UNAUTHORIZED)
//         .json({ message: "Unauthorized" });
//       return;
//     }
//   };
// };
import { Request, Response, NextFunction } from "express";
import { JWTService } from "../services/jwt.service";
import { HTTP_STATUS_CODES } from "../constants/httpStatusCode";

export const authenticate = (role: "user" | "admin" | "company") => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const accessToken = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;

      if (!accessToken) {
        res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ message: "Unauthorized: No access token" });
        return;
      }

      let decodedAccess = JWTService.verifyAccessToken(role, accessToken);
      let userPayload: { id: string; email: string; role: string } | null =
        null;

      if (!decodedAccess) {
        if (!refreshToken) {
          res
            .status(HTTP_STATUS_CODES.UNAUTHORIZED)
            .json({ message: "Unauthorized: No refresh token" });
          return;
        }

        const decodedRefresh = JWTService.verifyRefreshToken(
          role,
          refreshToken
        );
        if (!decodedRefresh) {
          res
            .status(HTTP_STATUS_CODES.UNAUTHORIZED)
            .json({ message: "Unauthorized: Invalid refresh token" });
          return;
        }

        const newAccessToken = JWTService.generateAccessToken(role, {
          id: decodedRefresh.id,
          email: decodedRefresh.email,
          role: decodedRefresh.role,
        });

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 1000,
        });

        decodedAccess = JWTService.verifyAccessToken(role, newAccessToken);
        userPayload = decodedRefresh;
      } else {
        userPayload = decodedAccess;
      }

      if (!userPayload) {
        res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ message: "Unauthorized: Invalid token" });
        return;
      }

      req.user = {
        id: userPayload.id,
        email: userPayload.email,
        role: userPayload.role,
      };

      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
      return;
    }
  };
};
