"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const languageSchema = new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    countries: [
        {
            type: String,
            ref: "Country",
        },
    ],
});
exports.default = mongoose_1.default.model("Language", languageSchema);
//# sourceMappingURL=language.js.map