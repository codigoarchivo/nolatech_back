import bcrypt from 'bcryptjs';
import { Request } from 'express-validator/lib/base';
import User from '../models/User';

const validatePassword = (password: string, { req }: Request) => {
  if (password !== req.body.password_repeat) {
    throw new Error('User / The passwords do not match - password');
  }

  return password === req.body.password_repeat;
};

const validatePasswordRepeat = (password_repeat: string, { req }: Request) => {
  if (password_repeat !== req.body.password) {
    throw new Error('User / The passwords do not match - password_repeat');
  }

  return password_repeat === req.body.password;
};

const passwordCompare = async (password: string, { req }: Request) => {
  const { email } = req.body;
  
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('The user was not created');
  }

  // Compare the password provided with the one stored in the database
  const passwordMatch = await bcrypt.compare(password, user.get().password);

  if (!passwordMatch) {
    throw new Error('User / Invalid password - Password');
  }

  return true
};

export default {
  validatePassword,
  validatePasswordRepeat,
  passwordCompare,
};
