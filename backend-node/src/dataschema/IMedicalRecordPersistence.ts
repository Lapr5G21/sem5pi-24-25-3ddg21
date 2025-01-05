export interface IMedicalRecordPersistence {
    domainId: string;
    patientMedicalRecordNumber: string;
    allergies: string[];
    medicalConditions: string[];
    notations: string;
  }