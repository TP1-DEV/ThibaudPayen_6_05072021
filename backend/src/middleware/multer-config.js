"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../assets/images');
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname + "-" + Date.now());
    }
});
exports.default = multer_1.default({ storage: storage }).single('image');
