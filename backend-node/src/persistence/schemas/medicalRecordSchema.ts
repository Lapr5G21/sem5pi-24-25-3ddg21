import mongoose from 'mongoose';
import { IMedicalRecordPersistence } from '../../dataschema/IMedicalRecordPersistence';

const medicalRecordSchema = new mongoose.Schema(
  {
    domainId: { type: String, required: true, unique: true, default: () => new mongoose.Types.ObjectId() },
    patientMedicalRecordNumber: { type: String, unique: true },
    allergies: { type: [String], unique: false},
    medicalConditions: { type: [String], unique: false},
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IMedicalRecordPersistence & mongoose.Document>('MedicalRecord', medicalRecordSchema);
