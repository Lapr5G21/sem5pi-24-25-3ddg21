"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllergyMap = void 0;
const Mapper_1 = require("../core/infra/Mapper");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const allergy_1 = require("../domain/Allergies/allergy");
class AllergyMap extends Mapper_1.Mapper {
    static toDTO(allergy) {
        var _a, _b;
        const rawData = ((_a = allergy.props) === null || _a === void 0 ? void 0 : _a._doc) || allergy.props || allergy;
        if (!rawData) {
            console.error("Invalid allergy object structure:", allergy);
            return null;
        }
        return {
            id: rawData.domainId || ((_b = allergy._id) === null || _b === void 0 ? void 0 : _b.toString()) || null,
            name: rawData.name || null,
            code: rawData.code || null,
            description: rawData.description || null
        };
    }
    static toDomain(allergy) {
        const allergyOrError = allergy_1.Allergy.create(allergy, new UniqueEntityID_1.UniqueEntityID(allergy.domainId));
        allergyOrError.isFailure ? console.log(allergyOrError.error) : '';
        return allergyOrError.isSuccess ? allergyOrError.getValue() : null;
    }
    static toPersistence(allergy) {
        return {
            name: allergy.name.value,
            code: allergy.code.value,
            description: allergy.description.value
        };
    }
}
exports.AllergyMap = AllergyMap;
//# sourceMappingURL=AllergyMap.js.map