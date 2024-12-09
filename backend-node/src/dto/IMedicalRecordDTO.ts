import { PatientMedicalRecordNumber } from "../domain/MedicalRecord/patientMedicalRecordNumber";

export default interface IMedicalRecordDTO {
    patientMedicalRecordNumber: string;
    allergies: string[];
    medicalConditions: string[];
    medicalHistory: string[];
  }