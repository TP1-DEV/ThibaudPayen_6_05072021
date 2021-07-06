"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var app = express_1.default();
var port = 3000;
var sauce_1 = __importDefault(require("./routes/sauce"));
var user_1 = __importDefault(require("./routes/user"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './assets/config/.env' });
mongoose_1.default.connect("" + process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function () { return console.log("Connexion à MongoDB réussie !"); })
    .catch(function () { return console.log("Connexion à MongoDB échouée !"); });
app.use(cors_1.default());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/api/sauces", sauce_1.default);
app.use("/api/auth", user_1.default);
app.use('/images', express_1.default.static(path_1.default.join(__dirname, './assets/images')));
app.listen(port, function () {
    console.log("Listening at http://localhost:" + port);
});
