import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IRolePersistence } from '../dataschema/IRolePersistence';

import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { MedicalCondition } from "../domain/MedicalConditions/medicalCondition";
import IMedicalConditionDTO from "../dto/IMedicalConditionDTO";
import { IMedicalConditionPersistence } from "../dataschema/IMedicalConditionPersistence";

export class MedicalConditionMap extends Mapper<MedicalCondition> {
  
  public static toDTO( medicalCondition: any): IMedicalConditionDTO {
    return {
      id: medicalCondition.id,
      name: medicalCondition.name,
      code:medicalCondition.code,
      description: medicalCondition.description,
      symptoms: medicalCondition.symptoms
    };
  }

  public static toDomain (medicalCondition: any | Model<IMedicalConditionPersistence & Document> ): MedicalCondition {
    const medicalConditionOrError = MedicalCondition.create(
        medicalCondition,
      new UniqueEntityID(medicalCondition.domainId)
    );

    medicalConditionOrError.isFailure ? console.log(medicalConditionOrError.error) : '';

    return medicalConditionOrError.isSuccess ? medicalConditionOrError.getValue() : null;
  }

  public static toPersistence (medicalCondition: MedicalCondition): any {
    return {
      name: medicalCondition.name.value,
      code: medicalCondition.code.value,
      description: medicalCondition.description.value,
      symptoms: medicalCondition.symptoms.value
    }
  }
}