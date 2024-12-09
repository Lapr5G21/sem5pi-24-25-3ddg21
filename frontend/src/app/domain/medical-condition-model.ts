// src/app/models/medical-condition-model.ts

export class CreateMedicalConditionDto {
    constructor(
        public medicalConditionName: string,
        public medicalConditionCode: string,
        public medicalConditionDescription: string,
        public medicalConditionSymptoms: string,
    ) {}
}


