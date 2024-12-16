export class CreateAllergiesDto {
    constructor(
        public name: string,
        public code: string,
        public description: string,
    ) {}
}

export class Allergy {
    constructor(
        public id: string,
        public name: string,
        public code : string,
        public description: string
    ) {}
}