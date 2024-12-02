// src/app/models/operation-type.model.ts

export class CreateOperationTypeDto {
    constructor(
        public name: string,
        public estimatedTimeDuration: number | null,
        public anesthesiaTime: number | null,
        public surgeryTime: number | null,
        public cleaningTime: number | null,
        public specializations: SpecializationDto[]
    ) {}
}

export class SpecializationDto {
    constructor(
        public specializationId: string,
        public numberOfStaff: number
    ) {}
}

export class Specialization {
    constructor(
        public id: string,
        public specializationName: string
    ) {}
}

export class CreatingSpecializationDto{
    constructor(
        public specializationName : string
    ){}
}
