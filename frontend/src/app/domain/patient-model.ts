// src/app/models/patient.model.ts

export class CreatePatientDto {
    constructor(
        public FirstName: string,
        public LastName: string,
        public FullName: string,
        public BirthDate: string,
        public Gender: string,
        public Email: string,
        public PhoneNumber: string,
        public Address: string,
        public EmergencyContact : string
    ) {}
}

