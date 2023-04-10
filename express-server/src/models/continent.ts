import mongoose from "mongoose";
import { ContinentType } from "../types/types";
const Schema = mongoose.Schema;

const continentSchema = new Schema<ContinentType>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  area: Number,
  population: Number,
  photo: String,
});

export default mongoose.model("Continent", continentSchema);
