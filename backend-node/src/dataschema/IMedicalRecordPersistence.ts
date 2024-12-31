export interface IMedicalRecordPersistence {
    domainId: string;
    patientMedicalRecordNumber: string;
    allergiesID: string[];
    medicalConditionsID: string[];
    notations: string;
  }