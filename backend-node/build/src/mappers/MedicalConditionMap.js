"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalConditionMap = void 0;
const Mapper_1 = require("../core/infra/Mapper");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const medicalCondition_1 = require("../domain/MedicalConditions/medicalCondition");
class MedicalConditionMap extends Mapper_1.Mapper {
    static toDTO(medicalCondition) {
        var _a, _b;
        const rawData = ((_a = medicalCondition.props) === null || _a === void 0 ? void 0 : _a._doc) || medicalCondition.props || medicalCondition;
        if (!rawData) {
            console.error("Invalid medicalCondition object structure:", medicalCondition);
            return null;
        }
        return {
            id: rawData.domainId || ((_b = medicalCondition._id) === null || _b === void 0 ? void 0 : _b.toString()) || null,
            name: rawData.name || null,
            code: rawData.code || null,
            description: rawData.description || null,
            symptoms: rawData.symptoms || null,
        };
    }
    static toDomain(medicalCondition) {
        const medicalConditionOrError = medicalCondition_1.MedicalCondition.create(medicalCondition, new UniqueEntityID_1.UniqueEntityID(medicalCondition.domainId));
        medicalConditionOrError.isFailure ? console.log(medicalConditionOrError.error) : '';
        return medicalConditionOrError.isSuccess ? medicalConditionOrError.getValue() : null;
    }
    static toPersistence(medicalCondition) {
        return {
            name: medicalCondition.name.value,
            code: medicalCondition.code.value,
            description: medicalCondition.description.value,
            symptoms: medicalCondition.symptoms.value
        };
    }
}
exports.MedicalConditionMap = MedicalConditionMap;
//# sourceMappingURL=MedicalConditionMap.js.map