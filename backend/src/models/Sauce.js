"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var sauceSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    /* likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    userLiked: { type: [String], required: true},
    dislikes: { type: [String], required: true }, */
});
exports.default = mongoose_1.default.model("Sauce", sauceSchema);
