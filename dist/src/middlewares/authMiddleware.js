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
exports.validateJWT = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
const validateJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        // Verify token
        const { id } = yield jwt_1.default.verifyToken(token);
        if (!id) {
            return res.status(400).json({ message: 'User ID not provided' });
        }
        // Find the user by ID
        const user = yield User_1.default.findByPk(id);
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
    }
    catch (error) {
        console.error('Error validating token:', error);
        return res.status(500).json({ message: 'Invalid token' });
    }
});
exports.validateJWT = validateJWT;
//# sourceMappingURL=authMiddleware.js.map