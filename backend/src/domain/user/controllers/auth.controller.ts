// authcontrller
import { Request, RequestHandler, Response } from "express";
import { UserRepository } from "../repositories/user.repositary";
import { UserService } from "../services/auth.service";
import { signupRequestSchema,signinRequestSchema } from "../dtos/user.request.dto";
import { ZodError } from "zod";
export class UserController {
  private userService: UserService;

  constructor() {
    const userRepository = new UserRepository();
    this.userService = new UserService(userRepository);
  }

  signUp :RequestHandler = async (req: Request, res: Response) : Promise<void> => {
    try {
      const userDTO=signupRequestSchema.parse(req.body);

      const user = await this.userService.signUp(userDTO);
      res.status(201).json({ success:true,message: "User created successfully", user });
    } catch (error: any) {
        if (error instanceof ZodError) {
            const errObj: Record<string, string> = {};
            error.errors.forEach(err => {
                errObj[err.path.join('.')] = err.message;
            })
            res.status(400).json({ success:false,errors: errObj });
            return;
          }
      res.status(400).json({ success:false,error: error.message });
    }
  };

  signIn = async (req: Request, res: Response) => {
    try {
      const userDTO = signinRequestSchema.parse(req.body)
      const result = await this.userService.signIn(userDTO);
      res.cookie('userRefreshToken', result.refreshToken, {
        httpOnly: true, // prevents JS access (important!)
        secure: process.env.NODE_ENV === 'production', // send over HTTPS in prod
        sameSite: 'strict', // prevents CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // cookie lifetime in ms
      });
      
      res.status(200).json({ success:true,message:"signin successfully",userAccessToken:result.accessToken,user:result.user });
    } catch (error: any) {
        if(error instanceof ZodError){
            const errObj:Record<string,string> = {};
            error.errors.forEach(err=> {
                errObj[err.path.join('.')]=err.message;
            })
            res.status(400).json({success:false,errors:errObj})
        }
      res.status(400).json({ error: error.message });
    }
  };
}
export const userController=new UserController();