import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IRolePersistence } from '../dataschema/IRolePersistence';

import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Allergy } from "../domain/Allergies/allergy";
import IAllergyDTO from "../dto/IAllergyDTO";
import { IAllergyPersistence } from "../dataschema/IAllergyPersistence";

export class AllergyMap extends Mapper<Allergy> {
  
  public static toDTO( allergy: any): IAllergyDTO {
    return {
      id: allergy.id,
      name: allergy.name,
      code:allergy.code,
      description: allergy.description
    };
  }

  public static toDomain (allergy: any | Model<IAllergyPersistence & Document> ): Allergy {
    const allergyOrError = Allergy.create(
      allergy,
      new UniqueEntityID(allergy.domainId)
    );

    allergyOrError.isFailure ? console.log(allergyOrError.error) : '';

    return allergyOrError.isSuccess ? allergyOrError.getValue() : null;
  }

  public static toPersistence (allergy: Allergy): any {
    return {
      name: allergy.name.value,
      code: allergy.code.value,
      description: allergy.description.value
    };
  }
}