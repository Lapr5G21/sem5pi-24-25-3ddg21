import { IAllergyPersistence } from '../../dataschema/IAllergyPersistence';
import mongoose from 'mongoose';

const AllergySchema = new mongoose.Schema(
  {
    domainId: { type: String, required: true, unique: true, default: () => new mongoose.Types.ObjectId() },
    name: { type: String, unique: true },
    code: { type: String, unique: true },
    description: { type: String, unique: false },
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IAllergyPersistence & mongoose.Document>('Allergy', AllergySchema);