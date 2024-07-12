"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("cloudinary");
const Server_1 = __importDefault(require("./src/models/Server"));
// config dotenv
dotenv_1.default.config();
// config cloudinary
cloudinary_1.v2.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// new server
const server = new Server_1.default();
// server listen
server.start();
//# sourceMappingURL=app.js.map