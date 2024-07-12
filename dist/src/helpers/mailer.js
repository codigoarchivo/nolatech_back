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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_1 = __importDefault(require("./jwt"));
dotenv_1.default.config();
const mailer = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_PASSWORD,
            },
        });
        const token = jwt_1.default.signToken({ email, expiresIn: '1h' });
        const link = `/activation/${token}`;
        const mailOptions = {
            from: process.env.MAILER_EMAIL,
            to: email,
            subject: 'Verification code',
            text: 'This is a code to log in:',
            html: `
        <p>You are almost ready to access. Click the link below to validate your email:</p>
        <a href='${link}' target='_blank'>${link}</a>
      `,
        };
        yield transporter.sendMail(mailOptions);
        return { ok: true };
    }
    catch (error) {
        return {
            ok: false,
            isError: `Error sending email: ${error.message}`,
        };
    }
});
exports.default = mailer;
//# sourceMappingURL=mailer.js.map