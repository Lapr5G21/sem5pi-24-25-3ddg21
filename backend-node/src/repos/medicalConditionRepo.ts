import { Service, Inject } from 'typedi';
import { Document, FilterQuery, Model } from 'mongoose';
import { IMedicalConditionPersistence } from '../dataschema/IMedicalConditionPersistence';
import { MedicalConditionId } from '../domain/MedicalConditions/medicalConditionId';
import { MedicalConditionMap } from '../mappers/MedicalConditionMap';
import IMedicalConditionRepo from '../services/IRepos/IMedicalConditionRepo';
import { MedicalCondition } from '../domain/MedicalConditions/medicalCondition';
import mongoose from '../loaders/mongoose';

@Service()
export default class MedicalConditionRepo implements IMedicalConditionRepo {
  private models: any;

  constructor(
    @Inject('medicalConditionSchema') private medicalConditionSchema : Model<IMedicalConditionPersistence & Document>,
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(medicalCondition: MedicalCondition): Promise<boolean> {
    
    const idX = medicalCondition.id instanceof MedicalConditionId ? (<MedicalConditionId>medicalCondition.id).toValue() : medicalCondition.id;

    const query = { domainId: idX}; 
    const medicalConditionDocument = await this.medicalConditionSchema.findOne( query as FilterQuery<IMedicalConditionPersistence & Document>);

    return !!medicalConditionDocument === true;
  }

  public async save (medicalCondition: MedicalCondition): Promise<MedicalCondition> {
    const query = { domainId: medicalCondition.id.toString()}; 

    let medicalConditionDocument = await this.medicalConditionSchema.findOne( query );

    try {
      if (medicalConditionDocument === null ) {
        const rawMedicalCondition: any = MedicalConditionMap.toPersistence(medicalCondition);
        const medicalConditionCreated = await this.medicalConditionSchema.create(rawMedicalCondition);

        return MedicalConditionMap.toDomain(medicalConditionCreated);
      } else {
        medicalConditionDocument.name = medicalCondition.name.toString();
        medicalConditionDocument.code = medicalCondition.code.toString();
        medicalConditionDocument.description = medicalCondition.description.toString();
        medicalConditionDocument.symptoms = medicalCondition.symptoms.toString();

        await medicalConditionDocument.save();
        return MedicalConditionMap.toDomain(medicalConditionDocument);
      }
    } catch (err) {
      throw err;
    }
  }

  public async getAll(): Promise<MedicalCondition[]> {
    try {
      const medicalConditionDocuments = await this.medicalConditionSchema.find({}).exec();
      return medicalConditionDocuments.map(doc => MedicalConditionMap.toDomain(doc)); 
    } catch (err) {
      throw new Error(`Error fetching medical conditions: ${err.message}`);
    }
  }

  public async findByDomainId (medicalConditionId: MedicalConditionId | string): Promise<MedicalCondition> {
    const query = { domainId: medicalConditionId};
    const medicalConditionRecord = await this.medicalConditionSchema.findOne( query as FilterQuery<IMedicalConditionPersistence & Document> );

    if( medicalConditionRecord != null) {
      return MedicalConditionMap.toDomain(medicalConditionRecord);
    }
    else
      return null;
  }
}