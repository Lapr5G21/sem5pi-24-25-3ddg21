"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MedicalConditionSchema = new mongoose_1.default.Schema({
    domainId: { type: String, required: true, unique: true, default: () => new mongoose_1.default.Types.ObjectId() },
    code: { type: String, unique: true },
    name: { type: String, unique: true },
    description: { type: String, unique: false },
    symptoms: { type: String, unique: true },
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('MedicalCondition', MedicalConditionSchema);
//# sourceMappingURL=medicalConditionSchema.js.map