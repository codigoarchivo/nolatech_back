"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = new sequelize_1.Sequelize(`${process.env.POSTGRES_DATABASE}`, `${process.env.POSTGRES_USER}`, `${process.env.POSTGRES_PASSWORD}`, {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    // dialectOptions: {
    //   ssl: (process.env as { DB_ENABLE_SSL: boolean | undefined }).DB_ENABLE_SSL ,
    // },
    port: 5433,
    pool: {
        max: 15,
        min: 5,
        idle: 20000,
        evict: 15000,
        acquire: 30000,
    },
});
exports.default = db;
//# sourceMappingURL=connection.js.map