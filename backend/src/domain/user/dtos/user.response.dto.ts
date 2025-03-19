
export interface SignUpResponseDTO {
    id: string;
    name: string;
    email: string;
    isVerified:boolean;
    expiresAt:Date;
  }

export interface SignInResponseDTO {
  accessToken:string;
  refreshToken:string;
  user:object
}

export interface createTempUserDTO {
  name:string;
  email:string;
  password:string;
}
