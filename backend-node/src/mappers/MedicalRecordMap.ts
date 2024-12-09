import { Mapper } from "../core/infra/Mapper";
import { Document, Model } from 'mongoose';
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { MedicalRecord } from "../domain/MedicalRecord/medicalRecord";
import IMedicalRecordDTO from "../dto/IMedicalRecordDTO";
import { IMedicalRecordPersistence } from "../dataschema/IMedicalRecordPersistence";

export class MedicalRecordMap extends Mapper<MedicalRecord> {
  
  public static toDTO( medicalRecord: any): IMedicalRecordDTO {
    return {
      patientMedicalRecordNumber: medicalRecord.patientMedicalRecordNumber,
      allergies: medicalRecord.allergies,
      medicalConditions:medicalRecord.medicalConditions,
      medicalHistory: medicalRecord.medicalHistory
    };
  }

  public static toDomain (allergy: any | Model<IMedicalRecordPersistence & Document> ): MedicalRecord {
    const medicalRecordOrError = MedicalRecord.create(
      allergy,
      new UniqueEntityID(allergy.domainId)
    );

    medicalRecordOrError.isFailure ? console.log(medicalRecordOrError.error) : '';

    return medicalRecordOrError.isSuccess ? medicalRecordOrError.getValue() : null;
  }

  public static toPersistence (medicalRecord: MedicalRecord): any {
    return {
      name: medicalRecord.patientMedicalRecordNumber.value,
      code: medicalRecord.allergies,
      description: medicalRecord.medicalConditions,
      medicalHistory: medicalRecord.medicalHistory
    };
  }
}