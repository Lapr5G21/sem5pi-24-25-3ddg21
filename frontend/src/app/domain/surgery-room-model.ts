import { RoomType } from '../domain/roomType-model';

export class CreateSurgeryRoomDto {
    constructor(
        public Id: string,
        public RoomTypeCode: string,
        public RoomCapacity: number,
        public MaintenanceSlots: string,
        public Equipment: string,
        public Status: string
    ){}
}


export class SurgeryRoom {
    constructor(
        public id: string,
        public roomType: RoomType,
        public roomCapacity: number,
        public maintenanceSlots: string,
        public equipment: string,
        public status: string   
    ) {}
}
