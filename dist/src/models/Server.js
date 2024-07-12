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
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("../db/connection"));
// routes
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const uploadRoutes_1 = __importDefault(require("../routes/uploadRoutes"));
class Server {
    constructor() {
        this.pathNames = {
            base: process.env.BASE || '/',
        };
        // create app
        this.app = (0, express_1.default)();
        // create  port
        this.port = process.env.PORT || '8000';
        // db postgres Sequelize
        this.dbConnection();
        // create middlewarwes
        this.middlewares();
        // routes
        this.routes();
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
                console.log('Online');
            }
            catch (error) {
                console.log(`Offline ${error}`);
            }
        });
    }
    middlewares() {
        // create cors
        this.app.use((0, cors_1.default)());
        // create express json
        this.app.use(express_1.default.json());
        // create public file
        this.app.use(express_1.default.static('public'));
        // create uploads
        this.app.use((0, express_fileupload_1.default)({
            limits: { fileSize: 5000000 },
            useTempFiles: true,
            tempFileDir: '/tmp/',
        }));
    }
    routes() {
        this.app.use(this.pathNames.base, authRoutes_1.default);
        this.app.use(this.pathNames.base, userRoutes_1.default);
        this.app.use(this.pathNames.base, uploadRoutes_1.default);
    }
    start() {
        this.app.listen(this.port, () => console.log(`Server is running on port ${this.port}`));
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map