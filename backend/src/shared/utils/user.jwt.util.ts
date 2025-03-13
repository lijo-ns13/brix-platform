import { ObjectId } from 'mongoose';
import { signToken, verifyToken } from './jwt.utils';

const USER_ACCESS_TOKEN_SECRET = process.env.USER_ACCESS_TOKEN_SECRET || 'userAccessSecret';
const USER_REFRESH_TOKEN_SECRET = process.env.USER_REFRESH_TOKEN_SECRET || 'userRefreshSecret';

export const generateUserAccessToken = (payload: { id:ObjectId,email:string }) => {
  return signToken(payload, USER_ACCESS_TOKEN_SECRET, '1h');
};

export const generateUserRefreshToken = (payload: { id:ObjectId,email:string }) => {
  return signToken(payload, USER_REFRESH_TOKEN_SECRET, '1d');
};

export const verifyUserAccessToken = (token: string) => {
  return verifyToken(token, USER_ACCESS_TOKEN_SECRET);
};

export const verifyUserRefreshToken = (token: string) => {
  return verifyToken(token, USER_REFRESH_TOKEN_SECRET);
};
