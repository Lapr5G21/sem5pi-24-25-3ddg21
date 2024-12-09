export interface IMedicalRecordPersistence {
    domainId: string;
    patientMedicalRecordNumber: string;
    allergies: string[];
    medicalConditions: string[];
    medicalHistory: string[];
  }