"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var auth_1 = __importDefault(require("../middleware/auth"));
var multer_config_1 = __importDefault(require("../middleware/multer-config"));
var sauce_1 = require("../controllers/sauce");
router.get('/', auth_1.default, sauce_1.getAllSauces);
router.get('/:id', auth_1.default, sauce_1.getOneSauce);
router.post('/', auth_1.default, multer_config_1.default, sauce_1.createSauce);
router.put('/:id', auth_1.default, multer_config_1.default, sauce_1.modifySauce);
router.delete('/:id', auth_1.default, sauce_1.deleteSauce);
exports.default = router;
