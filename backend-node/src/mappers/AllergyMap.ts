import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';

import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Allergy } from "../domain/Allergies/allergy";
import IAllergyDTO from "../dto/IAllergyDTO";
import { IAllergyPersistence } from "../dataschema/IAllergyPersistence";

export class AllergyMap extends Mapper<Allergy> {
  
  public static toDTO( allergy: any): IAllergyDTO {

    const rawData = allergy.props?._doc || allergy.props || allergy;

    return {
      id: rawData.id,
      name: rawData.name || null,
      code: rawData.code || null,
      description: rawData.description || null
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