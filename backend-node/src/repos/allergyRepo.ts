import { Service, Inject } from 'typedi';

import IRoleRepo from "../services/IRepos/IRoleRepo";
import { Role } from "../domain/role";
import { RoleId } from "../domain/roleId";
import { RoleMap } from "../mappers/RoleMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IRolePersistence } from '../dataschema/IRolePersistence';
import { IAllergyPersistence } from '../dataschema/IAllergyPersistence';
import { Allergy } from '../domain/Allergies/allergy';
import { AllergyId } from '../domain/Allergies/allergyId';
import { AllergyMap } from '../mappers/AllergyMap';
import IAllergyRepo from '../services/IRepos/IAllergyRepo';

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

    const allergyDocument = await this.allergySchema.findOne( query );

    try {
      if (allergyDocument === null ) {
        const rawAllergy: any = AllergyMap.toPersistence(allergy);

        const allergyCreated = await this.allergySchema.create(rawAllergy);

        return AllergyMap.toDomain(allergyCreated);
      } else {
        allergyDocument.name = allergy.name;
        await allergyDocument.save();

        return allergy;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId (allergyId: AllergyId | string): Promise<Allergy> {
    const query = { domainId: allergyId};
    const allergyRecord = await this.allergySchema.findOne( query as FilterQuery<IAllergyPersistence & Document> );

    if( allergyRecord != null) {
      return AllergyMap.toDomain(allergyRecord);
    }
    else
      return null;
  }
}