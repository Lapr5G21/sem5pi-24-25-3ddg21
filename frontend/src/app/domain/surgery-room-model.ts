export class CreateSurgeryRoomDto {
    constructor(
        public Number: string,
        public RoomTypeCode: string,
        public Capacity: number,
        public MaintenanceSlots: string,
        public Equipment: string,
        public Status: string
    ){}
}

/*
export class SurgeryRoom {
    constructor(
        public Code: string,
        public Designation: string,
        public Description: string,
        public SurgerySuitability: boolean,    
    ) {}
}*/
