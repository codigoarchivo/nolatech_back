import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import mailer from '../helpers/mailer';
import jwt from '../helpers/jwt';

const createUser = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'The email is already registered' });
    }
    const sendMailResult = await mailer(email);
    if (!sendMailResult.ok) {
      return res.status(403).json({ msg: sendMailResult.isError });
    }
    // Encrypt the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(403).json({ msg: 'The user was not created' });
    }

    return res.status(204).end();
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Input validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }
    // Search for the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // verify status
    if (!user.get().is_active) {
      return res.status(403).json({ msg: 'User is not active' });
    }
    // Verify the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    // Generate a JWT token
    const token = jwt.infoToken({
      first_name: user.get().first_name,
      last_name: user.get().last_name,
      profile_image: user.get().profile_image,
      is_admin: user.get().is_admin,
      email: user.get().email,
      id: user.get().id,
    });

    const accessToken = token.accessToken;
    const refreshToken = token.refreshToken;

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error('failed to login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const activation = async (req: Request, res: Response) => {
  try {
    const { email } = req.body.user;

    // Search for the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(403).json({ message: 'The user was not created' });
    }
    // Update the user's status only if the email matches.
    const [updatedRows] = await User.update(
      { is_active: true },
      { where: { email: user.get().email } }
    );

    if (updatedRows === 0) {
      return res.status(403).json({ msg: 'User is not active' });
    }
    // Generate a JWT token
    const token = jwt.infoToken({
      first_name: user.get().first_name,
      last_name: user.get().last_name,
      profile_image: user.get().profile_image,
      is_admin: user.get().is_admin,
      email: user.get().email,
      id: user.get().id,
    });

    const accessToken = token.accessToken;
    const refreshToken = token.refreshToken;

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Bad Request' });
  }
};

const refreshTokens = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }
    // Generate a JWT token
    const token = jwt.infoToken({
      first_name: user.first_name,
      last_name: user.last_name,
      profile_image: user.profile_image,
      is_admin: user.is_admin,
      email: user.email,
      id: user.id,
    });

    const accessToken = token.accessToken;
    const refreshToken = token.refreshToken;

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Error al refrescar tokens:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default {
  createUser,
  loginUser,
  activation,
  refreshTokens,
};
