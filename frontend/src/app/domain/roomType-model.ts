export class CreateRoomTypeDto {
    constructor(
        public Code: string,
        public Designation: string,
        public Description: string,
        public IsSuitableForSurgery: boolean,
    ){}
}


export class RoomType {
    constructor(
        public code: string,
        public designation: string,
        public description: string,
        public isSuitableForSurgery: boolean,    
    ) {}
}
