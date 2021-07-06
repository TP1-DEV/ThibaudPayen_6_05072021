import mongoose from "mongoose"

const sauceSchema = new mongoose.Schema({
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

export default mongoose.model("Sauce", sauceSchema);
