import { Service, Inject } from 'typedi';
import { Document, FilterQuery, Model } from 'mongoose';
import { IAllergyPersistence } from '../dataschema/IAllergyPersistence';
import { AllergyId } from '../domain/Allergies/allergyId';
import { AllergyMap } from '../mappers/AllergyMap';
import IAllergyRepo from '../services/IRepos/IAllergyRepo';
import { Allergy } from '../domain/Allergies/allergy';
import mongoose from '../loaders/mongoose';

@Service()
export default class AllergyRepo implements IAllergyRepo {
  private models: any;

  constructor(
    @Inject('allergySchema') private allergySchema : Model<IAllergyPersistence & Document>,
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(allergy: Allergy): Promise<boolean> {
    
    const idX = allergy.id instanceof AllergyId ? (<AllergyId>allergy.id).toValue() : allergy.id;

    const query = { domainId: idX}; 
    const allergyDocument = await this.allergySchema.findOne( query as FilterQuery<IAllergyPersistence & Document>);

    return !!allergyDocument === true;
  }

  public async save (allergy: Allergy): Promise<Allergy> {
    const query = { domainId: allergy.id.toString()}; 

    let allergyDocument = await this.allergySchema.findOne( query );

    try {
      if (allergyDocument === null ) {
        const rawAllergy: any = AllergyMap.toPersistence(allergy);
        const allergyCreated = await this.allergySchema.create(rawAllergy);

        return AllergyMap.toDomain(allergyCreated);
      } else {
        allergyDocument.name = allergy.props.name.value;
        allergyDocument.code = allergy.props.code.value;
        allergyDocument.description = allergy.props.description.value;

        await allergyDocument.save();
        
        return AllergyMap.toDomain(allergyDocument);
      }
    } catch (err) {
      throw err;
    }
  }

  public async getAll(): Promise<Allergy[]> {
    try {
      const allergyDocuments = await this.allergySchema.find({}).exec();
      return allergyDocuments.map(doc => AllergyMap.toDomain(doc)); 
    } catch (err) {
      throw new Error(`Error fetching allergies: ${err.message}`);
    }
  }

  public async findByDomainId(allergyId: AllergyId | string): Promise<Allergy> {
    
    try {
        
    const query = { domainId: allergyId.toString() };

    console.log('Query:', query);
    const allergyRecord = await this.allergySchema.findOne(query as FilterQuery<IAllergyPersistence & Document>);

    console.log('AllergyRecord:', allergyRecord);

    if (allergyRecord != null) {
        return AllergyMap.toDomain(allergyRecord);
    } else {
        return null;
    }
  } catch (error) {
    console.error('Error fetching allergy:', error);
    return null;
  }
}


public async delete (allergy: Allergy): Promise<any> {
    const query = { domainId: allergy.id.toString() };
    await this.allergySchema.deleteOne(query);
  }
}