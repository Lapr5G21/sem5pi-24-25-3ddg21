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
    try {

      let medicalRecordDocument = await this.medicalRecordSchema.findOne( query );

      if (medicalRecordDocument === null ) {


        const rawMedicalRecord: any = MedicalRecordMap.toPersistence(medicalRecord);

        const medicalRecordCreated = await this.medicalRecordSchema.create(rawMedicalRecord);

        return MedicalRecordMap.toDomain(medicalRecordCreated);
      } else {

        medicalRecordDocument.patientMedicalRecordNumber = medicalRecord.props.patientMedicalRecordNumber.value;
        medicalRecordDocument.allergiesID = medicalRecord.props.allergiesId.map(a => a.toString());
        console.log("Medical conditions before saving:", medicalRecord.medicalConditionsId);
        medicalRecordDocument.medicalConditionsID = medicalRecord.medicalConditionsId.map(a => a.toString());
        

        await medicalRecordDocument.save();
        return MedicalRecordMap.toDomain(medicalRecordDocument);
      }
    } catch (err) {
      throw new Error(`Could not save medical record: ${err.message}`);
    }
  }

  public async getAll(): Promise<MedicalRecord[]> {
    try {
      const medicalRecordDocuments = await this.medicalRecordSchema.find({}).exec();
      console.log("repo:", medicalRecordDocuments);
      return medicalRecordDocuments.map(doc => MedicalRecordMap.toDomain(doc)); 
    } catch (err) {
      throw new Error(`Error fetching medical records: ${err.message}`);
    }
  }

  public async findByDomainId (medicalRecordId: MedicalRecordId | string): Promise<MedicalRecord> {
    const query = { domainId: medicalRecordId.toString() };
    const medicalRecordRecord = await this.medicalRecordSchema.findOne( query as FilterQuery<IMedicalRecordPersistence & Document> );

    if( medicalRecordRecord != null) {
      return MedicalRecordMap.toDomain(medicalRecordRecord);
    }
    else
      return null;
  } catch (error) {
    console.error('Error finding medical record:', error);
    return null;
  }

  public async delete (medicalRecord: MedicalRecord): Promise<any> {
      const query = { domainId: medicalRecord.id.toString() };
      await this.medicalRecordSchema.deleteOne(query);
    }
}