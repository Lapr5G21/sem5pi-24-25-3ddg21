import { Mapper } from "../core/infra/Mapper";
import { Document, Model } from 'mongoose';
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { MedicalRecord } from "../domain/MedicalRecord/medicalRecord";
import IMedicalRecordDTO from "../dto/IMedicalRecordDTO";
import { IMedicalRecordPersistence } from "../dataschema/IMedicalRecordPersistence";

export class MedicalRecordMap extends Mapper<MedicalRecord> {
  
  public static toDTO( medicalRecord: any): IMedicalRecordDTO {

    const rawData = medicalRecord.props?._doc || medicalRecord.props || medicalRecord;


    if (!rawData) {
      console.error("Invalid medicalCondition object structure:", medicalRecord);
      return null;
    } 

    return {
      id: rawData.domainId || medicalRecord._id?.toString() || null,
      patientMedicalRecordNumber: rawData.patientMedicalRecordNumber || null,
      allergiesID: rawData.allergiesID || null,
      medicalConditionsID: rawData.medicalConditionsID || null,
    };
  }

  public static toDomain (medicalRecord: any | Model<IMedicalRecordPersistence & Document> ): MedicalRecord {
    const medicalRecordOrError = MedicalRecord.create(
      medicalRecord,
      new UniqueEntityID(medicalRecord.domainId)
    );

    medicalRecordOrError.isFailure ? console.log(medicalRecordOrError.error) : '';

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