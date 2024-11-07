
export class CreateOperationRequestDTO {
    constructor(

        public priority: string[],
        public operationType: OperationTypeDTO,
        public deadLineDate: string,
        public status: string,
        public DoctorId: DoctorDTO,
        public PatientId: PatientDTO
    ) {}
}


export class OperationTypeDTO {
    constructor(
        public operationTypeId: string
    ) {}
}

export class DoctorDTO {
    constructor(
        public doctorId: string
    ) {}
}

export class PatientDTO {
    constructor(
        public patientId: string
    ) {}
}
