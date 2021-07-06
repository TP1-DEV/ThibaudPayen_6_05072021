import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import path from 'path'

const app = express()
const port = 3000


import sauceRoutes from "./routes/sauce"
import userRoutes from "./routes/user"
import dotenv from "dotenv"

dotenv.config({path: './assets/config/.env'});

mongoose.connect(`${process.env.DB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
app.use('/images', express.static(path.join(__dirname, './assets/images')));

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})