"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var User_1 = __importDefault(require("../models/User"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
var signup = function (req, res, next) {
    bcrypt_1.default.hash(req.body.password, 10)
        .then(function (hash) {
        var user = new User_1.default({
            email: req.body.email,
            password: hash,
        });
        user.save()
            .then(function () { return res.status(201).json({ message: "Utilisateur créé !" }); })
            .catch(function (error) { return res.status(400).json({ error: error }); });
    })
        .catch(function (error) { return res.status(500).json({ error: error }); });
};
exports.signup = signup;
var login = function (req, res, next) {
    User_1.default.findOne({ email: req.body.email })
        .then(function (user) {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt_1.default.compare(req.body.password, user.password)
            .then(function (valid) {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
                userId: user._id,
                token: jsonwebtoken_1.default.sign({ userId: user._id }, "" + process.env.TOKEN, { expiresIn: '24h' })
            });
        })
            .catch(function (error) { return res.status(500).json({ error: error }); });
    })
        .catch(function (error) { return res.status(500).json({ error: error }); });
};
exports.login = login;
