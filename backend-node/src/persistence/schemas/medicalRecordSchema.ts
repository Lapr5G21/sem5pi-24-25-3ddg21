import mongoose from 'mongoose';
import { IMedicalRecordPersistence } from '../../dataschema/IMedicalRecordPersistence';
import allergySchema from './allergySchema';
import medicalConditionSchema from './medicalConditionSchema';

const medicalRecordSchema = new mongoose.Schema(
  {
    domainId: { type: String, required: true, unique: true, default: () => new mongoose.Types.ObjectId() },
    patientMedicalRecordNumber: { type: String, unique: true },
    allergies: { type: [allergySchema], unique: false },
    medicalConditions: { type: [medicalConditionSchema], unique: false },
    medicalHistory: { type: [String], unique: false },
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IMedicalRecordPersistence & mongoose.Document>('MedicalRecord', medicalRecordSchema);
