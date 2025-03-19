import jwt, { Secret } from 'jsonwebtoken';


interface JwtPayload {
  id: string;
  email: string;
}

  

export class JWTService {
  static signToken(payload: JwtPayload, secret: Secret, expiresIn: string): string {
    return jwt.sign(payload, secret, { expiresIn });
  }

  static verifyToken(token: string, secret: Secret): JwtPayload | null {
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (err) {
      console.log('Token verification failed', err);
      return null;
    }
  }

  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (err) {
      console.log('Token decoding failed', err);
      return null;
    }
  }

  static generateAccessToken(role: 'user' | 'admin' | 'company', payload: JwtPayload) {
    const { access, accessExpiry } = JWTService.getSecret(role);
    return this.signToken(payload, access, accessExpiry);
  }

  static generateRefreshToken(role: 'user' | 'admin' | 'company', payload: JwtPayload) {
    const { refresh, refreshExpiry } = JWTService.getSecret(role);
    return this.signToken(payload, refresh, refreshExpiry);
  }

  static verifyAccessToken(role: 'user' | 'admin' | 'company', token: string): JwtPayload | null {
    const { access } = JWTService.getSecret(role);
    return this.verifyToken(token, access);
  }

  static verifyRefreshToken(role: 'user' | 'admin' | 'company', token: string): JwtPayload | null {
    const { refresh } = JWTService.getSecret(role);
    return this.verifyToken(token, refresh);
  }

  private static getSecret(role: 'user' | 'admin' | 'company') {
    const secrets = require('./jwt.constants').JWT_SECRETS[role];
    if (!secrets) throw new Error(`Unknown role: ${role}`);
    return {
      access: secrets.access,
      refresh: secrets.refresh,
      accessExpiry: secrets.accessExpiry,
      refreshExpiry: secrets.refreshExpiry
    };
  }
}
