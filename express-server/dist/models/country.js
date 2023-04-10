"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const countrySchema = new Schema({
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
exports.default = mongoose_1.default.model("Country", countrySchema);
//# sourceMappingURL=country.js.map