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
        public EmergencyContact: string
    ) {}
}

// Enum PatientGender para limitar os valores aceites no campo Gender
export enum PatientGender {
    Male = 'Male',
    Female = 'Female',
    RatherNotSay = 'RatherNotSay'
}

// DTO para edição do paciente
export class EditPatientDto {
    constructor(
        public FirstName: string,
        public LastName: string,
        public FullName: string,
        public MedicalRecord: string,
        public Email: string,
        public PhoneNumber: string,
        public Address: string,
    ) {}
}

export class Patient {
    constructor(
        public medicalRecordNumber: string,  
        public firstName: string,            
        public lastName: string,             
        public fullName: string,             
        public birthDate: string,           
        public gender: string,              
        public email: string,                
        public phoneNumber: string,          
        public address: string,              
        public emergencyContact: string,     
        public medicalRecord: string,        
    ) {}
}
