"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const medicalRecordSchema = new mongoose_1.default.Schema({
    domainId: { type: String, required: true, unique: true, default: () => new mongoose_1.default.Types.ObjectId() },
    patientMedicalRecordNumber: { type: String, unique: false },
    allergies: { type: [String], unique: false, default: [] },
    medicalConditions: { type: [String], unique: false, default: [] },
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('MedicalRecord', medicalRecordSchema);
//# sourceMappingURL=medicalRecordSchema.js.map