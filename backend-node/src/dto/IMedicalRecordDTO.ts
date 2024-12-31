import { PatientMedicalRecordNumber } from "../domain/MedicalRecord/patientMedicalRecordNumber";

export default interface IMedicalRecordDTO {
    id: string;
    patientMedicalRecordNumber: string;
    allergiesId: string[];
    medicalConditionsId: string[];
    notations: string;
  }