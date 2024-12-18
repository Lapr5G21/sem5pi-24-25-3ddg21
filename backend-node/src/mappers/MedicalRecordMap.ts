import { Mapper } from "../core/infra/Mapper";
import { Document, Model } from 'mongoose';
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { MedicalRecord } from "../domain/MedicalRecord/medicalRecord";
import IMedicalRecordDTO from "../dto/IMedicalRecordDTO";
import { IMedicalRecordPersistence } from "../dataschema/IMedicalRecordPersistence";

export class MedicalRecordMap extends Mapper<MedicalRecord> {
  
  public static toDTO( medicalRecord: any): IMedicalRecordDTO {

    if (!medicalRecord) {
      console.error("MedicalRecord is null or undefined aqui.");
      return null;
    }

    const rawData = medicalRecord._doc || medicalRecord;

    if (!rawData) {
      console.error("Invalid medicalCondition object structure:", medicalRecord);
      return null;
    } 

    return {
      id: rawData.domainId || medicalRecord._id?.toString() || null,
      patientMedicalRecordNumber: rawData.patientMedicalRecordNumber || null,
      allergiesID: rawData.allergiesID || [],
      medicalConditionsID: rawData.medicalConditionsID || [],
    };
  }

  public static toDomain (medicalRecord: any | Model<IMedicalRecordPersistence & Document> ): MedicalRecord {

    console.log("todomain",medicalRecord );

    const medicalRecordOrError = MedicalRecord.create(
      medicalRecord,
      new UniqueEntityID(medicalRecord.domainId)
    );

    medicalRecordOrError.isFailure ? console.log(medicalRecordOrError.error) : '';

    console.log( " toDomain : ", medicalRecordOrError );
    return medicalRecordOrError.isSuccess ? medicalRecordOrError.getValue() : null;
  }

  public static toPersistence (medicalRecord: MedicalRecord): any {
    return {
      id : medicalRecord.id.toString(),
      patientMedicalRecordNumber: medicalRecord.patientMedicalRecordNumber.value,
      allergies: medicalRecord.allergiesID,
      medicalConditions: medicalRecord.medicalConditionsID,
    };
  }
}