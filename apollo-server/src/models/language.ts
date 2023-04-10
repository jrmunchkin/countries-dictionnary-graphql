import mongoose from "mongoose";
import { LanguageType } from "../types/types";
const Schema = mongoose.Schema;

const languageSchema = new Schema<LanguageType>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  countries: [
    {
      type: String,
      ref: "Country",
    },
  ],
});

export default mongoose.model("Language", languageSchema);
