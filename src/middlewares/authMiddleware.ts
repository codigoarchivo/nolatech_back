import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import jwt from '../helpers/jwt';

export const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    // Verify token
    const { id } = await jwt.verifyToken(token);
    if (!id) {
      return res.status(400).json({ message: 'User ID not provided' });
    }
    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }
    // Check user status
    if (!user.get().is_active) {
      return res.status(403).json({ message: 'User is not active' });
    }
    // Store user data in the request body
    req.body.user = user.get();

    next();
  } catch (error) {
    console.error('Error validating token:', error);
    return res.status(500).json({ message: 'Invalid token' });
  }
};
