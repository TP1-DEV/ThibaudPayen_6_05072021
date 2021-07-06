"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSauce = exports.modifySauce = exports.createSauce = exports.getOneSauce = exports.getAllSauces = void 0;
var Sauce_1 = __importDefault(require("../models/Sauce"));
var fs_1 = __importDefault(require("fs"));
var getAllSauces = function (req, res, next) {
    Sauce_1.default.find()
        .then(function (sauces) { res.status(200).json(sauces); })
        .catch(function (error) { res.status(400).json({ error: error }); });
};
exports.getAllSauces = getAllSauces;
var getOneSauce = function (req, res, next) {
    Sauce_1.default.findOne({ _id: req.params.id })
        .then(function (sauce) { res.status(200).json(sauce); })
        .catch(function (error) { res.status(404).json({ error: error }); });
};
exports.getOneSauce = getOneSauce;
var createSauce = function (req, res, next) {
    var sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    var sauce = new Sauce_1.default(__assign(__assign({}, sauceObject), { imageUrl: req.protocol + "://" + req.get("host") + "/images/" + req.file.filename }));
    sauce.save()
        .then(function () { return res.status(201).json({ message: "Sauce ajoutée !" }); })
        .catch(function (error) { return res.status(400).json({ error: error }); });
};
exports.createSauce = createSauce;
var modifySauce = function (req, res, next) {
    var sauceObject = req.file
        ? __assign(__assign({}, JSON.parse(req.body.sauce)), { imageUrl: req.protocol + "://" + req.get("host") + "/images/" + req.file.filename }) : __assign({}, req.body);
    Sauce_1.default.updateOne({ _id: req.params.id }, __assign(__assign({}, sauceObject), { _id: req.params.id }))
        .then(function () { return res.status(200).json({ message: "Sauce modifiée !" }); })
        .catch(function (error) { return res.status(400).json({ error: error }); });
};
exports.modifySauce = modifySauce;
var deleteSauce = function (req, res, next) {
    Sauce_1.default.findOne({ _id: req.params.id })
        .then(function (sauce) {
        var filename = sauce.imageUrl.split("/images/")[1];
        fs_1.default.unlink("images/" + filename, function () {
            Sauce_1.default.deleteOne({ _id: req.params.id })
                .then(function () { return res.status(200).json({ message: "Sauce supprimée !" }); })
                .catch(function (error) { return res.status(400).json({ error: error }); });
        });
    })
        .catch(function (error) { return res.status(500).json({ error: error }); });
};
exports.deleteSauce = deleteSauce;
