"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AllergySchema = new mongoose_1.default.Schema({
    domainId: { type: String, required: true, unique: true, default: () => new mongoose_1.default.Types.ObjectId() },
    name: { type: String, unique: false },
    code: { type: String, unique: true },
    description: { type: String, unique: false },
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Allergy', AllergySchema);
//# sourceMappingURL=allergySchema.js.map