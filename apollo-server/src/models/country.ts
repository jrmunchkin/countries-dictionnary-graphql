import mongoose from "mongoose";
import { CountryType } from "../types/types";
const Schema = mongoose.Schema;

const countrySchema = new Schema<CountryType>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  area: Number,
  population: Number,
  currency: String,
  capital: String,
  flag: String,
  continent: { type: String, required: true },
  neighbors: [
    {
      type: String,
      ref: "Country",
    },
  ],
  languages: [
    {
      type: String,
      ref: "Language",
    },
  ],
});

export default mongoose.model("Country", countrySchema);
