"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordAllergies = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Guard_1 = require("../../core/logic/Guard");
const Result_1 = require("../../core/logic/Result");
class MedicalRecordAllergies extends ValueObject_1.ValueObject {
    get value() {
        return this.props.allergies;
    }
    constructor(props) {
        super(props);
    }
    static create(props) {
        const propsResult = Guard_1.Guard.againstNullOrUndefined(props.allergies, 'allergies');
        if (!propsResult.succeeded) {
            return Result_1.Result.fail(propsResult.message);
        }
        else {
            return Result_1.Result.ok(new MedicalRecordAllergies({
                allergies: props.allergies,
            }));
        }
    }
    static createAllergies(allergies) {
        return allergies.map(allergy => new MedicalRecordAllergies({ allergies: [allergy] }));
    }
}
exports.MedicalRecordAllergies = MedicalRecordAllergies;
//# sourceMappingURL=medicalRecordAllergies.js.map