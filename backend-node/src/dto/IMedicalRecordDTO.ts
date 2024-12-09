import { PatientMedicalRecordNumber } from "../domain/MedicalRecord/patientMedicalRecordNumber";

export default interface IMedicalRecordDTO {
    DomainId: string;
    patientMedicalRecordNumber: string;
    allergies: string[];
    medicalConditions: string[];
    medicalHistory: string[];
  }