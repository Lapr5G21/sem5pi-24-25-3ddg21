// src/app/models/staff.model.ts

export class CreateStaffDto {
    constructor(
        public staffFirstName: string,
        public staffLastName: string,
        public staffFullName: string,
        public staffLicenseNumber: string,
        public specializations: SpecializationDto[],
        public staffEmail: string,
        public staffPhoneNumber: string,
        public staffAvailabilitySlots: string,
        public username: string
    ) {}
}

export class SpecializationDto {
    constructor(
        public specializationId: string,
    ) {}
}

export class Specialization {
    constructor(
        public id: string,
        public specializationName: string
    ) {}
}

export class EditStaffDto {
    constructor(
        public staffId: string,
        public staffFirstName: string,
        public staffLastName: string,
        public staffFullName: string,
        public staffLicenseNumber: string,
        public specializations: SpecializationDto[],
        public staffEmail: string,
        public staffPhoneNumber: string,
        public staffAvailabilitySlots: string,
        public username: string
    ) {}
}

