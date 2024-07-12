"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validatePassword_1 = __importDefault(require("../helpers/validatePassword"));
const rateLimit_1 = require("../helpers/rateLimit ");
const validateToken_1 = __importDefault(require("../helpers/validateToken"));
const validateFields_1 = require("../middlewares/validateFields");
const authMiddleware_1 = require("../middlewares/authMiddleware");
// controllers
const authController_1 = __importDefault(require("../controllers/authController"));
const router = (0, express_1.Router)();
router.post('/users/', [
    rateLimit_1.limiter,
    (0, express_validator_1.check)('first_name', 'First Name is required').notEmpty(),
    (0, express_validator_1.check)('last_name', 'Last Name is required').notEmpty(),
    (0, express_validator_1.check)('email', 'Email is required').notEmpty().isEmail(),
    (0, express_validator_1.check)('password', {
        titulo: 'Your password must have:',
        message1: 'minimum 8 characters long.',
        message2: 'At least one capital letter.',
        message3: 'At least one lowercase.',
        message4: 'At least one number.',
        message5: 'At least one special character.',
    })
        .notEmpty()
        .trim()
        .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
    })
        .custom(validatePassword_1.default.validatePassword),
    (0, express_validator_1.check)('password_repeat').custom(validatePassword_1.default.validatePasswordRepeat),
    validateFields_1.validateFields,
], authController_1.default.createUser);
router.post('/jwt/create/', [
    rateLimit_1.limiter,
    (0, express_validator_1.check)('email', 'Email is required').isEmail(),
    (0, express_validator_1.check)('password', 'Password is required')
        .notEmpty()
        .trim()
        .custom(validatePassword_1.default.passwordCompare),
    validateFields_1.validateFields,
], authController_1.default.loginUser);
router.post('/users/activation/', [
    rateLimit_1.limiter,
    (0, express_validator_1.check)('token', 'Token is required')
        .notEmpty()
        .isJWT()
        .custom(validateToken_1.default.validateToken),
    validateFields_1.validateFields,
], authController_1.default.activation);
router.post('/jwt/refresh/', [
    authMiddleware_1.validateJWT,
    (0, express_validator_1.check)('refresh', 'Token is required')
        .notEmpty()
        .isJWT()
        .custom(validateToken_1.default.validateRefresh),
    validateFields_1.validateFields,
], authController_1.default.refreshTokens);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map