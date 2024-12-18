export class MedicalRecord {
    constructor(
        public id: string,
        public patientMedicalRecordNumber: string,
        public allergies : string[],
        public medicalConditions: string[]
    ) {}
}