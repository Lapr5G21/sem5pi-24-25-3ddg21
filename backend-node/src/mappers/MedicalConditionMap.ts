import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IRolePersistence } from '../dataschema/IRolePersistence';

import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { MedicalCondition } from "../domain/MedicalConditions/medicalCondition";
import IMedicalConditionDTO from "../dto/IMedicalConditionDTO";
import { IMedicalConditionPersistence } from "../dataschema/IMedicalConditionPersistence";

export class MedicalConditionMap extends Mapper<MedicalCondition> {
  
  public static toDTO(medicalCondition: any): IMedicalConditionDTO {
    
    const rawData = medicalCondition.props?._doc || medicalCondition.props || medicalCondition;
  
    if (!rawData) {
      console.error("Invalid medicalCondition object structure:", medicalCondition);
      return null;
    }
  
    
    return {
      id: rawData.domainId || medicalCondition._id?.toString() || null,
      name: rawData.name || null,
      code: rawData.code || null,
      description: rawData.description || null,
      symptoms: rawData.symptoms || null,
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