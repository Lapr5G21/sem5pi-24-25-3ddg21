// src/app/models/medical-condition-model.ts

export class CreateMedicalConditionDto {
    constructor(
        public name: string,
        public code: string,
        public description: string,
        public symptoms: string,
    ) {}
}


