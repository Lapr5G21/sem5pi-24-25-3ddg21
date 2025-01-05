import { Mapper } from "../core/infra/Mapper";
import { Document, Model } from 'mongoose';
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { MedicalRecord } from "../domain/MedicalRecord/medicalRecord";
import IMedicalRecordDTO from "../dto/IMedicalRecordDTO";
import { IMedicalRecordPersistence } from "../dataschema/IMedicalRecordPersistence";
import { MedicalRecordAllergies } from "../domain/MedicalRecord/medicalRecordAllergies";
import { MedicalRecordMedicalConditions } from "../domain/MedicalRecord/medicalRecordMedicalConditions";

export class MedicalRecordMap extends Mapper<MedicalRecord> {
  
  public static toDTO(medicalRecord: any): IMedicalRecordDTO | null {

    if (!medicalRecord) {
      console.error("MedicalRecord is null or undefined.");
      return null;
    }
  
    const rawData = medicalRecord._doc || medicalRecord;

    if (!rawData || typeof rawData !== 'object') {
      console.error("Invalid medicalRecord object structure:", medicalRecord);
      return null;
    }
  
    return {
      id: rawData.domainId || medicalRecord._id?.toString() || null,
      patientMedicalRecordNumber: rawData.patientMedicalRecordNumber || null,
      allergiesId: rawData.allergiesId?.map((a: any) => a._id || a) || [],
      medicalConditionsId: rawData.medicalConditionsId?.map((mc: any) => mc._id || mc) || [],
      notations: rawData.notations || null,
    };
  }
  
  public static toDomain(medicalRecord: any | Model<IMedicalRecordPersistence & Document>): MedicalRecord {
  
    const medicalRecordProps = {
      patientMedicalRecordNumber: medicalRecord.patientMedicalRecordNumber,
      allergiesId: medicalRecord.allergies || [],
      medicalConditionsId: medicalRecord.medicalConditions || [],
      notations: medicalRecord.notations || null,
    };
  
    const medicalRecordOrError = MedicalRecord.create(
      medicalRecordProps,
      new UniqueEntityID(medicalRecord.domainId)
    );
  
    if (medicalRecordOrError.isFailure) {
      console.error("Error creating MedicalRecord domain object:", medicalRecordOrError.error);
    }
  
    return medicalRecordOrError.isSuccess ? medicalRecordOrError.getValue() : null;
  }
  
  public static toPersistence (medicalRecord: MedicalRecord): any {
    return {
      id : medicalRecord.id.toString(),
      patientMedicalRecordNumber: medicalRecord.props.patientMedicalRecordNumber.value,
      allergies: medicalRecord.props.allergiesId.map(allergy => allergy.props.allergies.toString()),
      medicalConditions: medicalRecord.props.medicalConditionsId.map(condition => condition.props.medicalConditions.toString()),
      notations: medicalRecord.props.notations.value,
    };
  }
}