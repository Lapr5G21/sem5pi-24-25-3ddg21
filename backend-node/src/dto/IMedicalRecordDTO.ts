import { PatientMedicalRecordNumber } from "../domain/MedicalRecord/patientMedicalRecordNumber";

export default interface IMedicalRecordDTO {
    id: string;
    patientMedicalRecordNumber: string;
    allergiesID: string[];
    medicalConditionsID: string[];
  }