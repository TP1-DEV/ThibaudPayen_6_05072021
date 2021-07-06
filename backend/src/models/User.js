"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
var userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
userSchema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model("User", userSchema);
