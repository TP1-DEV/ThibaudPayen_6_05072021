"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
exports.default = (function (req, res, next) {
    try {
        var token = (typeof req.headers.authorization === 'string') ? req.headers.authorization.split(' ')[1] : "";
        var decodedToken = jsonwebtoken_1.default.verify(token, "" + process.env.TOKEN);
        var userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        }
        else {
            next();
        }
    }
    catch (_a) {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
});
