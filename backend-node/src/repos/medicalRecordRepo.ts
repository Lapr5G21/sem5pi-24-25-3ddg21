import { Service, Inject } from 'typedi';
import { Document, FilterQuery, Model } from 'mongoose';
import IMedicalRecordRepo from '../services/IRepos/IMedicalRecordRepo';
import { IMedicalRecordPersistence } from '../dataschema/IMedicalRecordPersistence';
import { MedicalRecord } from '../domain/MedicalRecord/medicalRecord';
import { MedicalRecordId } from '../domain/MedicalRecord/medicalRecordId';
import { MedicalRecordMap } from '../mappers/MedicalRecordMap';

@Service()
export default class MedicalRecordRepo implements IMedicalRecordRepo {
  private models: any;

  constructor(
    @Inject('medicalRecordSchema') private medicalRecordSchema : Model<IMedicalRecordPersistence & Document>,) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(medicalRecord: MedicalRecord): Promise<boolean> {
    
    const idX = medicalRecord.id instanceof MedicalRecordId ? (<MedicalRecordId>medicalRecord.id).toValue() : medicalRecord.id;

    const query = { domainId: idX}; 
    const medicalRecordDocument = await this.medicalRecordSchema.findOne( query as FilterQuery<IMedicalRecordPersistence & Document>);

    return !!medicalRecordDocument === true;
  }

  public async save (medicalRecord: MedicalRecord): Promise<MedicalRecord> {
    const query = { domainId: medicalRecord.id.toString()}; 

    let medicalRecordDocument = await this.medicalRecordSchema.findOne( query );

    try {
      if (medicalRecordDocument === null ) {
        const rawMedicalRecord: any = MedicalRecordMap.toPersistence(medicalRecord);
        const medicalRecordCreated = await this.medicalRecordSchema.create(rawMedicalRecord);

        return MedicalRecordMap.toDomain(medicalRecordCreated);
      } else {

        medicalRecordDocument.domainId = medicalRecord.id.toString();
        medicalRecordDocument.patientMedicalRecordNumber = medicalRecord.patientMedicalRecordNumber.toString();
        medicalRecordDocument.allergies = medicalRecord.allergies.map(a => a.toString());
        medicalRecordDocument.medicalConditions = medicalRecord.medicalConditions.map(a => a.toString());
        medicalRecordDocument.medicalHistory = medicalRecord.medicalHistory.map(a => a.toString());

        await medicalRecordDocument.save();
        return MedicalRecordMap.toDomain(medicalRecordDocument);
      }
    } catch (err) {
      throw err;
    }
  }

  public async getAll(): Promise<MedicalRecord[]> {
    try {
      const medicalRecordDocuments = await this.medicalRecordSchema.find({}).exec();
      return medicalRecordDocuments.map(doc => MedicalRecordMap.toDomain(doc)); 
    } catch (err) {
      throw new Error(`Error fetching medical records: ${err.message}`);
    }
  }

  public async findByDomainId (medicalRecordId: MedicalRecordId | string): Promise<MedicalRecord> {
    const query = { domainId: medicalRecordId};
    const medicalRecordRecord = await this.medicalRecordSchema.findOne( query as FilterQuery<IMedicalRecordPersistence & Document> );

    if( medicalRecordRecord != null) {
      return MedicalRecordMap.toDomain(medicalRecordRecord);
    }
    else
      return null;
  }
}