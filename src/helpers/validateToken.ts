import { Request } from 'express-validator/lib/base';
import jwt from './jwt';

export const validateToken = async (token: string, { req }: Request) => {
  // Check the refresh token
  const user = await jwt.verifyToken(token);

  if (!user) {
    throw new Error('Invalid refresh token');
  }
   
  req.body.user = user
};
