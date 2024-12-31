import { Service, Inject } from 'typedi';
import { Document, FilterQuery, Model } from 'mongoose';
import { IMedicalConditionPersistence } from '../dataschema/IMedicalConditionPersistence';
import { MedicalConditionId } from '../domain/MedicalConditions/medicalConditionId';
import { MedicalConditionMap } from '../mappers/MedicalConditionMap';
import IMedicalConditionRepo from '../services/IRepos/IMedicalConditionRepo';
import { MedicalCondition } from '../domain/MedicalConditions/medicalCondition';
import mongoose from '../loaders/mongoose';
import ISearchMedicalConditionDTO from '../dto/ISearchMedicalConditionDTO';

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

  public async save(medicalCondition: MedicalCondition): Promise<MedicalCondition> {
    const query = { domainId: medicalCondition.id.toString() };
    try {
      let medicalConditionDocument = await this.medicalConditionSchema.findOne(query);
  
      if (medicalConditionDocument === null) {
        const rawMedicalCondition = MedicalConditionMap.toPersistence(medicalCondition);
  
        const medicalConditionCreated = await this.medicalConditionSchema.create(rawMedicalCondition);
  
        return MedicalConditionMap.toDomain(medicalConditionCreated);
      } else {

        medicalConditionDocument.name = medicalCondition.props.name.value;
        medicalConditionDocument.code = medicalCondition.props.code.value;
        medicalConditionDocument.description = medicalCondition.props.description.value;
        medicalConditionDocument.symptoms = medicalCondition.props.symptoms.value;

        await medicalConditionDocument.save();
  
        return MedicalConditionMap.toDomain(medicalConditionDocument);
      }
    } catch (err) {
      console.error("Error saving medical condition:", err);
      throw new Error(`Could not save medical condition: ${err.message}`);
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

  public async findByDomainId(medicalConditionId: MedicalConditionId | string): Promise<MedicalCondition> {
    try {
      const query = { domainId: medicalConditionId.toString() };
      const medicalConditionRecord = await this.medicalConditionSchema.findOne(query as FilterQuery<IMedicalConditionPersistence & Document>);
  
      if (medicalConditionRecord != null) {
        return MedicalConditionMap.toDomain(medicalConditionRecord);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error finding medical condition:', error);
      return null;
    }
  }
  
  public async searchMedicalConditions(searchDto: ISearchMedicalConditionDTO): Promise<MedicalCondition[]> {
    try {    
      const filters: FilterQuery<IMedicalConditionPersistence & Document> = {};
    
      if (!searchDto.name && !searchDto.code) {
        throw new Error("At least one search parameter ('name' or 'code') is required.");
      }
    
      if (searchDto.name) {
        filters.name = {
          $regex: `^${searchDto.name.trim()}`, 
          $options: 'i',
        };
      }
    
      if (searchDto.code) {
        filters.code = {
          $regex: `^${searchDto.code.trim()}`,
          $options: 'i', 
        };
      }
        
      const medicalConditionDocuments = await this.medicalConditionSchema.find(filters).exec();
    
      if (medicalConditionDocuments.length === 0) {
        console.log("No medical conditions found for the query.");
      }
    
      return medicalConditionDocuments.map(doc => MedicalConditionMap.toDomain(doc));
    
    } catch (err) {
      console.error("Error during search in repository:", err);
      throw new Error(`Error searching for medical conditions: ${err.message}`);
    }
  }
  
  public async delete (medicalCondition: MedicalCondition): Promise<any> {
    const query = { domainId: medicalCondition.id.toString() };
    await this.medicalConditionSchema.deleteOne(query);
  }
}