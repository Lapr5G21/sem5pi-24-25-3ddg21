"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const mongoose_1 = require("mongoose");
const allergyId_1 = require("../domain/Allergies/allergyId");
const AllergyMap_1 = require("../mappers/AllergyMap");
let AllergyRepo = class AllergyRepo {
    constructor(allergySchema) {
        this.allergySchema = allergySchema;
    }
    createBaseQuery() {
        return {
            where: {},
        };
    }
    async exists(allergy) {
        const idX = allergy.id instanceof allergyId_1.AllergyId ? allergy.id.toValue() : allergy.id;
        const query = { domainId: idX };
        const allergyDocument = await this.allergySchema.findOne(query);
        return !!allergyDocument === true;
    }
    async save(allergy) {
        const query = { domainId: allergy.id.toString() };
        let allergyDocument = await this.allergySchema.findOne(query);
        try {
            if (allergyDocument === null) {
                const rawAllergy = AllergyMap_1.AllergyMap.toPersistence(allergy);
                const allergyCreated = await this.allergySchema.create(rawAllergy);
                return AllergyMap_1.AllergyMap.toDomain(allergyCreated);
            }
            else {
                allergyDocument.name = allergy.name.toString();
                allergyDocument.code = allergy.code.toString();
                allergyDocument.description = allergy.description.toString();
                await allergyDocument.save();
                return AllergyMap_1.AllergyMap.toDomain(allergyDocument);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async getAll() {
        try {
            const allergyDocuments = await this.allergySchema.find({}).exec();
            return allergyDocuments.map(doc => AllergyMap_1.AllergyMap.toDomain(doc));
        }
        catch (err) {
            throw new Error(`Error fetching allergies: ${err.message}`);
        }
    }
    async findByDomainId(allergyId) {
        try {
            const query = { domainId: allergyId.toString() };
            const allergyRecord = await this.allergySchema.findOne(query);
            if (allergyRecord != null) {
                return AllergyMap_1.AllergyMap.toDomain(allergyRecord);
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error('Error fetching allergy:', error);
            return null;
        }
    }
    async delete(allergy) {
        const query = { domainId: allergy.id.toString() };
        await this.allergySchema.deleteOne(query);
    }
};
AllergyRepo = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('allergySchema')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], AllergyRepo);
exports.default = AllergyRepo;
//# sourceMappingURL=allergyRepo.js.map