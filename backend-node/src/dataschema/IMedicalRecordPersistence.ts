export interface IMedicalRecordPersistence {
    domainId: string;
    patientMedicalRecordNumber: string;
    allergiesId: string[];
    medicalConditionsId: string[];
    notations: string;
  }