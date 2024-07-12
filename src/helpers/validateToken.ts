import { Request } from 'express-validator/lib/base';
import jwt from './jwt';

const validateToken = async (token: string, { req }: Request) => {
  // Check the refresh token
  const user = await jwt.verifyToken(token);

  if (!user) {
    throw new Error('Invalid token');
  }
   
  req.body.user = user
};
const validateRefresh = async (refresh: string) => {
  // Check the refresh token
  const user = await jwt.verifyToken(refresh);

  if (!user) {
    throw new Error('Invalid refresh token');
  }

  return true
};

export default {
  validateToken,
  validateRefresh,
}