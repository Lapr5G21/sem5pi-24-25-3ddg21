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

    // Verifica se o registro médico é nulo ou indefinido
    if (!medicalRecord) {
      console.error("MedicalRecord is null or undefined.");
      return null;
    }
  
    // Acessa os dados do registro médico
    const rawData = medicalRecord._doc || medicalRecord;
    console.log('rawData bbbbbbbbbbbbbbbbbbbbbbbbb', rawData);

    // Verifica se rawData é válido
    if (!rawData || typeof rawData !== 'object') {
      console.error("Invalid medicalRecord object structure:", medicalRecord);
      return null;
    }
  
    // Verifica os dados do registro médico
    console.log("rawData:", rawData);  // Verificando os dados antes de mapear

    // Retorna o DTO com os dados processados
    return {
      id: rawData.domainId || medicalRecord._id?.toString() || null,  // ID do registro médico
      patientMedicalRecordNumber: rawData.patientMedicalRecordNumber || null,  // Número do prontuário
      allergiesId: rawData.allergiesId?.map((a: any) => a._id || a) || [],  // IDs de alergias (garante que se a alergia for um objeto, o _id seja extraído)
      medicalConditionsId: rawData.medicalConditionsId?.map((mc: any) => mc._id || mc) || [],  // IDs das condições médicas
      notations: rawData.notations || null,  // Notações do prontuário
    };
  }
  
  public static toDomain(medicalRecord: any | Model<IMedicalRecordPersistence & Document>): MedicalRecord {
    console.log("toDomain input medicalRecord:", medicalRecord);
  
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