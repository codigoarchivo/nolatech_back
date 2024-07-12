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
const validatePassword = (password, { req }) => {
    if (password !== req.body.password_repeat) {
        throw new Error('User / The passwords do not match - password');
    }
    return password === req.body.password;
};
const validatePasswordRepeat = (password, { req }) => {
    if (password !== req.body.password) {
        throw new Error('User / The passwords do not match - password_repeat');
    }
    return password === req.body.password_repeat;
};
const passwordCompare = (password, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield User_1.default.findOne({ where: { email } });
    if (!user) {
        throw new Error('The user was not created');
    }
    // Compare the password provided with the one stored in the database
    const passwordMatch = yield bcryptjs_1.default.compare(password, user.get().password);
    if (!passwordMatch) {
        throw new Error('User / Invalid password - Password');
    }
    return true;
});
exports.default = {
    validatePassword,
    validatePasswordRepeat,
    passwordCompare,
};
//# sourceMappingURL=validatePassword.js.map