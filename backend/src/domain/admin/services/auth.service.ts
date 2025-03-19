
import bcrypt from 'bcrypt';
import { AdminAuthRepository } from '../repositories/admin.auth.repository';
import { AdminSignInRequestDTO } from '../dtos/admin.auth.request.dto';

import { JWTService } from '../../../shared/services/jwt.service';
export class AdminAuthService {
  
  constructor(
    private adminAuthRepositary:AdminAuthRepository
  ) {}

  async signIn(payload: AdminSignInRequestDTO) {
    const admin = await this.adminAuthRepositary.findByEmail(payload.email);
    if (!admin) throw new Error('Admin not found');

    const isPasswordValid = await bcrypt.compare(payload.password, admin.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const accessToken = JWTService.generateAccessToken('admin',{id:admin._id.toString(),email:admin.email});
    const refreshToken = JWTService.generateRefreshToken('admin',{id:admin._id.toString(),email:admin.email});

    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      accessToken,
      refreshToken
    };
  }
}

