// src/app/models/patient.model.ts

export class CreatePatientDto {
    constructor(
        public FirstName: string,
        public LastName: string,
        public FullName: string,
        public BirthDate: string,
        public Gender: PatientGender,
        public Email: string,
        public PhoneNumber: string,
        public Address: string,
        public EmergencyContact : string
    ) {}
}

// Enum PatientGender para limitar os valores aceites nocampo Gender
export enum PatientGender {
    Male = 'Male',
    Female = 'Female',
    RatherNotSay = 'RatherNotSay'
}

export class EditPatientDto {
    constructor(
        public FirstName: string,
        public LastName: string,
        public FullName: string,
        public MedicalRecord : string,
        public Email: string,
        public PhoneNumber: string,
        public Address: string,
    ) {}
}

