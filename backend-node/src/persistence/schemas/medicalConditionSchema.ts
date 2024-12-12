import { IMedicalConditionPersistence } from '../../dataschema/IMedicalConditionPersistence';
import mongoose from 'mongoose';

const MedicalConditionSchema = new mongoose.Schema(
  {
    domainId: { type: String, required: true, unique: true, default: () => new mongoose.Types.ObjectId() },
    code: { type: String, unique: true },
    name: { type: String, unique: true },
    description: { type: String, unique: false },
    symptoms: { type: String, unique: true },
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IMedicalConditionPersistence & mongoose.Document>('MedicalCondition', MedicalConditionSchema);