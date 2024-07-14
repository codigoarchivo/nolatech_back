"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const rateLimit_1 = require("../helpers/rateLimit ");
const validateFields_1 = require("../middlewares/validateFields");
const authMiddleware_1 = require("../middlewares/authMiddleware");
// controllers
const userController_1 = __importDefault(require("../controllers/userController"));
const router = (0, express_1.Router)();
router.get('/users/', [rateLimit_1.limiter, authMiddleware_1.validateJWT], userController_1.default.usersGet);
router.get('/users/:id', [rateLimit_1.limiter, authMiddleware_1.validateJWT], userController_1.default.userGet);
router.patch('/users/:id', [
    rateLimit_1.limiter,
    authMiddleware_1.validateJWT,
    (0, express_validator_1.check)('first_name', 'First Name is required').notEmpty(),
    (0, express_validator_1.check)('last_name', 'Last Name is required').notEmpty(),
    (0, express_validator_1.check)('profile_image', 'Image is required'),
    validateFields_1.validateFields,
], userController_1.default.userPatch);
router.delete('/users/:id', [rateLimit_1.limiter, authMiddleware_1.validateJWT], userController_1.default.userDelete);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map