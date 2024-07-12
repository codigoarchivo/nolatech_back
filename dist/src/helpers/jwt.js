"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signToken = (props) => {
    const { id = '', email = '', expiresIn } = props, user = __rest(props, ["id", "email", "expiresIn"]);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('No JWT secret provided');
    }
    return jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, user), { id, email }), jwtSecret, { expiresIn });
};
const infoToken = (props) => {
    if (!props) {
        throw new Error('Incomplete data to generate tokens');
    }
    // Genera tokens JWT
    const accessToken = signToken(Object.assign(Object.assign({}, props), { expiresIn: '1m' }));
    const refreshToken = signToken(Object.assign(Object.assign({}, props), { expiresIn: '5d' }));
    return {
        accessToken,
        refreshToken,
    };
};
const verifyToken = (token) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return Promise.reject('No JWT secret provided');
    }
    if (!token) {
        return Promise.reject('JWT token is empty');
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
        return Promise.resolve(decodedToken);
    }
    catch (error) {
        return Promise.reject('Invalid JWT token');
    }
};
exports.default = {
    signToken,
    infoToken,
    verifyToken,
};
//# sourceMappingURL=jwt.js.map