import { Mapper } from "../core/infra/Mapper";
import { Document, Model } from 'mongoose';
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { MedicalRecord } from "../domain/MedicalRecord/medicalRecord";
import IMedicalRecordDTO from "../dto/IMedicalRecordDTO";
import { IMedicalRecordPersistence } from "../dataschema/IMedicalRecordPersistence";

export class MedicalRecordMap extends Mapper<MedicalRecord> {
  
  public static toDTO( medicalRecord: any): IMedicalRecordDTO {

    if (!medicalRecord) {
      console.error("MedicalRecord is null or undefined .");
      return null;
    }

    const rawData = medicalRecord._doc || medicalRecord;

    if (!rawData || typeof rawData !== 'object') {
      console.error("Invalid medicalCondition object structure:", medicalRecord);
      return null;
    } 

    return {
      id: rawData.domainId || medicalRecord._id?.toString() || null,
      patientMedicalRecordNumber: rawData.patientMedicalRecordNumber || null,
      allergiesID: rawData.allergies?.map(a => a._id || a) || [],
      medicalConditionsID: rawData.medicalConditionsID?.map(mc => mc._id) || [],
    };
  }

  public static toDomain(medicalRecord: any): MedicalRecord {
    console.log("toDomain input medicalRecord:", medicalRecord);
  
    const medicalRecordOrError = MedicalRecord.create(
      {
        patientMedicalRecordNumber: medicalRecord.patientMedicalRecordNumber,
        allergiesID: medicalRecord.allergies || [],
        medicalConditionsID: medicalRecord.medicalConditions || [],
      },
      new UniqueEntityID(medicalRecord.domainId)
    );
  
    if (medicalRecordOrError.isFailure) {
      console.error("Error creating MedicalRecord domain object:", medicalRecordOrError.error);
    } else {
      console.log("Successfully created domain object:", medicalRecordOrError.getValue());
    }
  
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