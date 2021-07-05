const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');

const sauceRoutes = require("../routes/sauce");
const userRoutes = require("../routes/user");

const app = express();

require("dotenv").config();

mongoose.connect(`${process.env.DB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;