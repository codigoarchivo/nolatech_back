import { Request, Response } from 'express';
import { Op } from 'sequelize';
import User from '../models/User';

const usersGet = async (req: Request, res: Response) => {
  const { page = 1, count = 10 } = req.query;
  const { search = '', create = 'DESC' } = req.query;

  try {
    // Query the database
    const userResults = await User.findAndCountAll({
      limit: Number(count),
      offset: (Number(page) - 1) * Number(count),
      order: [['created_at', `${create}`]],
      attributes: { exclude: ['password'] },
      where: {
        [Op.or]: [
          {
            first_name: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            last_name: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
        is_active: true,
      },
    });
    // Build the response
    const pagination = {
      total: userResults.count,
      pages: Math.ceil(userResults.count / Number(count)),
      currentPage: Number(page),
      count: Number(count),
    };

    return res.status(200).json({
      users: userResults.rows,
      pagination,
    });
  } catch (error) {
    console.error('Error querying database:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const userGet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const foundUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    if (!foundUser) {
      return res.status(403).json({ message: 'User not found' });
    }
    // Return user data
    return res.status(200).json({ user: foundUser.get() });
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const userPatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    // Check if the user exists before trying to update it
    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Update user fields
    await existingUser.update(updatedFields);

    return res.status(200).json({
      msg: 'User changes were made correctly',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      msg: 'Internal server error',
    });
  }
};

const userDelete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the user exists before trying to update it
    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Deactivate the user (instead of removing them completely)
    await existingUser.update({ is_active: false });

    return res.status(200).json({
      msg: 'The user was deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating user:', error);
    return res.status(500).json({
      msg: 'Internal server error',
    });
  }
};

export default {
  usersGet,
  userGet,
  userPatch,
  userDelete,
};
