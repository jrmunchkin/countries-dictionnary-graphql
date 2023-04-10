"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const citySchema = new Schema({
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
exports.default = mongoose_1.default.model("City", citySchema);
//# sourceMappingURL=city.js.map