// authservice
import { UserRepository } from "../repositories/user.repositary";
import { SignupRequestDTO,SigninRequestDTO } from "../dtos/user.request.dto";
import { UserResponseDTO,SignInResponseDTO } from "../dtos/user.response.dto";
import * as bcrypt from "bcryptjs";
import { generateUserAccessToken,generateUserRefreshToken } from "../../../shared/utils/admin.jwt.util";
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async signUp(payload: SignupRequestDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(payload.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const user = await this.userRepository.createUser({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      verified: false, // You can set this as part of your flow
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    };
  }

  async signIn(payload: SigninRequestDTO): Promise<SignInResponseDTO> {
    const user = await this.userRepository.findByEmail(payload.email);
    if(!user){
      throw new Error("Invalid email")
    }
    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Password");
    }
    // token generation
    const userAccessToken=generateUserAccessToken({id:user._id,email:user.email})
    const userRefreshToken=generateUserRefreshToken({id:user._id,email:user.email})
    console.log(userAccessToken,typeof(userAccessToken),'accesstoken')
    return { accessToken:userAccessToken,refreshToken:userRefreshToken ,user:{name:user.name,email:user.email}};
  }
}
