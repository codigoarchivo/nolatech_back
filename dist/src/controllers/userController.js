"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const User_1 = __importDefault(require("../models/User"));
const usersGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, count = 10 } = req.query;
    const { search = '', create = 'DESC' } = req.query;
    try {
        // Query the database
        const userResults = yield User_1.default.findAndCountAll({
            limit: Number(count),
            offset: (Number(page) - 1) * Number(count),
            order: [['created_at', `${create}`]],
            attributes: { exclude: ['password'] },
            where: {
                [sequelize_1.Op.or]: [
                    {
                        first_name: {
                            [sequelize_1.Op.like]: `%${search}%`,
                        },
                    },
                    {
                        last_name: {
                            [sequelize_1.Op.like]: `%${search}%`,
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
    }
    catch (error) {
        console.error('Error querying database:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
const userGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Find the user by ID
        const foundUser = yield User_1.default.findByPk(id, {
            attributes: { exclude: ['password'] },
        });
        if (!foundUser) {
            return res.status(403).json({ message: 'User not found' });
        }
        // Return user data
        return res.status(200).json({ user: foundUser.get() });
    }
    catch (error) {
        console.error('Error retrieving user data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
const userPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedFields = req.body;
        // Check if the user exists before trying to update it
        const existingUser = yield User_1.default.findByPk(id);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update user fields
        yield existingUser.update(updatedFields);
        return res.status(200).json({
            msg: 'User changes were made correctly',
        });
    }
    catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            msg: 'Internal server error',
        });
    }
});
const userDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if the user exists before trying to update it
        const existingUser = yield User_1.default.findByPk(id);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Deactivate the user (instead of removing them completely)
        yield existingUser.update({ is_active: false });
        return res.status(200).json({
            msg: 'The user was deactivated successfully',
        });
    }
    catch (error) {
        console.error('Error deactivating user:', error);
        return res.status(500).json({
            msg: 'Internal server error',
        });
    }
});
exports.default = {
    usersGet,
    userGet,
    userPatch,
    userDelete,
};
//# sourceMappingURL=userController.js.map