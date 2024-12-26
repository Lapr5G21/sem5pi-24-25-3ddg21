export class CreateRoomTypeDto {
    constructor(
        public Code: string,
        public Designation: string,
        public Description: string,
        public SurgerySuitability: boolean,
    ){}
}


export class RoomType {
    constructor(
        public Code: string,
        public Designation: string,
        public Description: string,
        public SurgerySuitability: boolean,    
    ) {}
}
