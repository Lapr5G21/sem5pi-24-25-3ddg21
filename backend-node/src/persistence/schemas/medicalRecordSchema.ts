import mongoose from 'mongoose';
import { IMedicalRecordPersistence } from '../../dataschema/IMedicalRecordPersistence';
import { AllergyId } from '../../domain/Allergies/allergyId';
import { MedicalConditionId } from '../../domain/MedicalConditions/medicalConditionId';

const medicalRecordSchema = new mongoose.Schema(
  {
    domainId: { type: String, required: true, unique: true, default: () => new mongoose.Types.ObjectId() },
    patientMedicalRecordNumber: { type: String, unique: true },
    allergies: { type: [String], unique: true },
    medicalConditions: { type: [String], unique: true },
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IMedicalRecordPersistence & mongoose.Document>('MedicalRecord', medicalRecordSchema);
