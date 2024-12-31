import mongoose from 'mongoose';
import { IMedicalRecordPersistence } from '../../dataschema/IMedicalRecordPersistence';

const medicalRecordSchema = new mongoose.Schema(
  {
    domainId: { type: String, required: true, unique: true, default: () => new mongoose.Types.ObjectId() },
    patientMedicalRecordNumber: { type: String },
    allergies: [{ type: String}],
    medicalConditions: [{ type: String}],
    notations: { type: String }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IMedicalRecordPersistence & mongoose.Document>('MedicalRecord', medicalRecordSchema);
