import { SurgeryRoom } from '../domain/surgery-room-model';

 // DTO completo para Appointment
export class Appointment {
    constructor(
        public id: string, // Guid
        public surgeryRoomDto: SurgeryRoom,
        public operationRequestDto: OperationRequestWithAllDataDto,
        public status: string,
        public dateAndTime: Date, // Date and time
        public team: StaffDto[] // List of StaffDto
    ) {}
}

// DTO completo para OperationRequestWithAllData
export class OperationRequestWithAllDataDto {
    constructor(
        public id: string, // Guid
        public doctorId: string,
        public operationType: OperationTypeDto,
        public medicalRecordNumber: string,
        public deadline: string, // ISO 8601 format string
        public priority: string,
        public status: string
    ) {}
}

// DTO completo para OperationType
export class OperationTypeDto {
    constructor(
        public id: string, // Guid
        public name: string,
        public estimatedDuration: number, // In minutes
        public surgeryTime: number, // In minutes
        public anesthesiaTime: number, // In minutes
        public cleaningTime: number // In minutes
    ) {}
}

// DTO completo para Staff
export class StaffDto {
    constructor(
        public staffId: string,
        public staffFirstName: string,
        public staffLastName: string,
        public staffFullName: string,
        public staffLicenseNumber: string,
        public specializationId: string,
        public staffEmail: string,
        public staffPhoneNumber: string,
        public staffAvailabilitySlots: AvailabilitySlot[], // List of availability slots
        public userId: string,
        public active: boolean
    ) {}
}

// DTO para AvailabilitySlot
export class AvailabilitySlot {
    constructor(
        public startTime: string, // Use ISO 8601 format for times
        public endTime: string // Example: '2023-01-04T10:00:00Z'
    ) {}
}
