import mongoose from "mongoose";
import { CityType } from "../types/types";
const Schema = mongoose.Schema;

const citySchema = new Schema<CityType>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  area: Number,
  population: Number,
  photo1: String,
  photo2: String,
  photo3: String,
  photo4: String,
  country: { type: String, required: true },
});

export default mongoose.model("City", citySchema);
