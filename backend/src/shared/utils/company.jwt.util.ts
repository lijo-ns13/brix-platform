import { ObjectId } from 'mongoose';
import { signToken, verifyToken } from './jwt.utils';

const COMPANY_ACCESS_TOKEN_SECRET = process.env.COMPANY_ACCESS_TOKEN_SECRET || 'userAccessSecret';
const COMPANY_REFRESH_TOKEN_SECRET = process.env.COMPANY_REFRESH_TOKEN_SECRET || 'userRefreshSecret';

export const generateUserAccessToken = (payload: { id:ObjectId,email:string }) => {
  return signToken(payload, COMPANY_ACCESS_TOKEN_SECRET, '1h');
};

export const generateUserRefreshToken = (payload: { id:ObjectId,email:string }) => {
  return signToken(payload, COMPANY_REFRESH_TOKEN_SECRET, '30d');
};

export const verifyUserAccessToken = (token: string) => {
  return verifyToken(token, COMPANY_ACCESS_TOKEN_SECRET);
};

export const verifyUserRefreshToken = (token: string) => {
  return verifyToken(token, COMPANY_REFRESH_TOKEN_SECRET);
};