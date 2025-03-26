import { Request, RequestHandler, Response } from "express";
import { UserManagementService } from "../services/user.management.service";
import { UserRepository } from "../repositories/user.repository";
import { HTTP_STATUS_CODES } from "../../../shared/constants/httpStatusCode";
export class UserController {
  private userManagementService: UserManagementService;

  constructor() {
    const userRepository = new UserRepository();
    this.userManagementService = new UserManagementService(userRepository);
  }

  // Block a user
  blockUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await this.userManagementService.blockUser(userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "User blocked successfully",
        data: user,
      });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  // Unblock a user
  unblockUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await this.userManagementService.unblockUser(userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "User unblocked successfully",
        data: user,
      });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  // Get paginated users
  getUsers: RequestHandler = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const usersData = await this.userManagementService.getUsers(page, limit);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Users fetched successfully",
        data: usersData,
      });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };
}

export const userController = new UserController();
