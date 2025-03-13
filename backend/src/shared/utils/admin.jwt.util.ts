import { ObjectId } from 'mongoose';
import { signToken, verifyToken } from './jwt.utils';

const ADMIN_ACCESS_TOKEN_SECRET = process.env.ADMIN_ACCESS_TOKEN_SECRET || 'userAccessSecret';
const ADMIN_REFRESH_TOKEN_SECRET = process.env.ADMIN_REFRESH_TOKEN_SECRET || 'userRefreshSecret';

export const generateUserAccessToken = (payload: { id:ObjectId,email:string }) => {
  return signToken(payload, ADMIN_ACCESS_TOKEN_SECRET, '1h');
};

export const generateUserRefreshToken = (payload: { id:ObjectId,email:string }) => {
  return signToken(payload, ADMIN_REFRESH_TOKEN_SECRET, '30d');
};

export const verifyUserAccessToken = (token: string) => {
  return verifyToken(token, ADMIN_ACCESS_TOKEN_SECRET);
};

export const verifyUserRefreshToken = (token: string) => {
  return verifyToken(token, ADMIN_REFRESH_TOKEN_SECRET);
};