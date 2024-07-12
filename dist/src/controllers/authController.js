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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const mailer_1 = __importDefault(require("../helpers/mailer"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, email, password } = req.body;
        // Check if the email is already registered
        const existingUser = yield User_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'The email is already registered' });
        }
        const sendMailResult = yield (0, mailer_1.default)(email);
        if (!sendMailResult.ok) {
            return res.status(403).json({ msg: sendMailResult.isError });
        }
        // Encrypt the password before saving it
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create the user
        const newUser = yield User_1.default.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
        });
        if (!newUser) {
            return res.status(403).json({ msg: 'The user was not created' });
        }
        return res.status(204).end();
    }
    catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Input validation
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: 'Email and password are required' });
        }
        // Search for the user by email
        const user = yield User_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // verify status
        if (!user.get().is_active) {
            return res.status(403).json({ msg: 'User is not active' });
        }
        // Verify the password
        const validPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        // Generate a JWT token
        const token = jwt_1.default.infoToken({
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
    }
    catch (error) {
        console.error('failed to login:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
const activation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body.user;
        // Search for the user by email
        const user = yield User_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(403).json({ message: 'The user was not created' });
        }
        // Update the user's status only if the email matches.
        const [updatedRows] = yield User_1.default.update({ is_active: true }, { where: { email: user.get().email } });
        if (updatedRows === 0) {
            return res.status(403).json({ msg: 'User is not active' });
        }
        // Generate a JWT token
        const token = jwt_1.default.infoToken({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Bad Request' });
    }
});
const refreshTokens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.user;
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }
        // Generate a JWT token
        const token = jwt_1.default.infoToken({
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
    }
    catch (error) {
        console.error('Error al refrescar tokens:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.default = {
    createUser,
    loginUser,
    activation,
    refreshTokens,
};
//# sourceMappingURL=authController.js.map