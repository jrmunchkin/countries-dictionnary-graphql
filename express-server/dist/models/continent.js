"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const continentSchema = new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    area: Number,
    population: Number,
    photo: String,
});
exports.default = mongoose_1.default.model("Continent", continentSchema);
//# sourceMappingURL=continent.js.map