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
const medicalConditionId_1 = require("../domain/MedicalConditions/medicalConditionId");
const MedicalConditionMap_1 = require("../mappers/MedicalConditionMap");
let MedicalConditionRepo = class MedicalConditionRepo {
    constructor(medicalConditionSchema) {
        this.medicalConditionSchema = medicalConditionSchema;
    }
    createBaseQuery() {
        return {
            where: {},
        };
    }
    async exists(medicalCondition) {
        const idX = medicalCondition.id instanceof medicalConditionId_1.MedicalConditionId ? medicalCondition.id.toValue() : medicalCondition.id;
        const query = { domainId: idX };
        const medicalConditionDocument = await this.medicalConditionSchema.findOne(query);
        return !!medicalConditionDocument === true;
    }
    async save(medicalCondition) {
        const query = { domainId: medicalCondition.id.toString() };
        try {
            // Procura pela condição médica existente no banco de dados
            let medicalConditionDocument = await this.medicalConditionSchema.findOne(query);
            if (medicalConditionDocument === null) {
                // Caso não exista, cria uma nova entrada
                const rawMedicalCondition = MedicalConditionMap_1.MedicalConditionMap.toPersistence(medicalCondition);
                // Cria a nova condição médica no banco
                const medicalConditionCreated = await this.medicalConditionSchema.create(rawMedicalCondition);
                // Retorna a entidade convertida para domínio
                return MedicalConditionMap_1.MedicalConditionMap.toDomain(medicalConditionCreated);
            }
            else {
                // Atualiza os campos no documento existente
                medicalConditionDocument.name = medicalCondition.props.name.value;
                medicalConditionDocument.code = medicalCondition.props.code.value;
                medicalConditionDocument.description = medicalCondition.props.description.value;
                medicalConditionDocument.symptoms = medicalCondition.props.symptoms.value;
                // Salva as alterações no banco
                await medicalConditionDocument.save();
                // Retorna a entidade atualizada convertida para o domínio
                return MedicalConditionMap_1.MedicalConditionMap.toDomain(medicalConditionDocument);
            }
        }
        catch (err) {
            // Tratamento de erro com mensagem clara e detalhada
            console.error("Error saving medical condition:", err);
            throw new Error(`Could not save medical condition: ${err.message}`);
        }
    }
    async getAll() {
        try {
            const medicalConditionDocuments = await this.medicalConditionSchema.find({}).exec();
            return medicalConditionDocuments.map(doc => MedicalConditionMap_1.MedicalConditionMap.toDomain(doc));
        }
        catch (err) {
            throw new Error(`Error fetching medical conditions: ${err.message}`);
        }
    }
    async findByDomainId(medicalConditionId) {
        try {
            const query = { domainId: medicalConditionId.toString() };
            const medicalConditionRecord = await this.medicalConditionSchema.findOne(query);
            if (medicalConditionRecord != null) {
                return MedicalConditionMap_1.MedicalConditionMap.toDomain(medicalConditionRecord);
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error('Error finding medical condition:', error);
            return null;
        }
    }
    async searchMedicalConditions(searchDto) {
        try {
            const filters = {};
            if (!searchDto.name && !searchDto.code) {
                throw new Error("At least one search parameter ('name' or 'code') is required.");
            }
            if (searchDto.name) {
                filters.name = {
                    $regex: `^${searchDto.name.trim()}`,
                    $options: 'i',
                };
            }
            if (searchDto.code) {
                filters.code = {
                    $regex: `^${searchDto.code.trim()}`,
                    $options: 'i',
                };
            }
            const medicalConditionDocuments = await this.medicalConditionSchema.find(filters).exec();
            if (medicalConditionDocuments.length === 0) {
                console.log("No medical conditions found for the query.");
            }
            return medicalConditionDocuments.map(doc => MedicalConditionMap_1.MedicalConditionMap.toDomain(doc));
        }
        catch (err) {
            console.error("Error during search in repository:", err);
            throw new Error(`Error searching for medical conditions: ${err.message}`);
        }
    }
    async delete(medicalCondition) {
        const query = { domainId: medicalCondition.id.toString() };
        await this.medicalConditionSchema.deleteOne(query);
    }
};
MedicalConditionRepo = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('medicalConditionSchema')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], MedicalConditionRepo);
exports.default = MedicalConditionRepo;
//# sourceMappingURL=medicalConditionRepo.js.map