"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateFields_1 = require("../middlewares/validateFields");
const uploadController_1 = __importDefault(require("../controllers/uploadController"));
const rateLimit_1 = require("../helpers/rateLimit ");
const router = (0, express_1.Router)();
// Path to upload profile image
router.put("/upload/", [
    rateLimit_1.limiter,
    authMiddleware_1.validateJWT,
    (0, express_validator_1.check)("profile_image"),
    validateFields_1.validateFields,
], uploadController_1.default // Driver to upload image to Cloudinary
);
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map