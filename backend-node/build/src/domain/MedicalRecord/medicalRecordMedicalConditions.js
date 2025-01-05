"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordMedicalConditions = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Guard_1 = require("../../core/logic/Guard");
const Result_1 = require("../../core/logic/Result");
class MedicalRecordMedicalConditions extends ValueObject_1.ValueObject {
    get value() {
        return this.props.medicalConditions;
    }
    constructor(props) {
        super(props);
    }
    static create(props) {
        const propsResult = Guard_1.Guard.againstNullOrUndefined(props.medicalConditions, 'medicalConditions');
        if (!propsResult.succeeded) {
            return Result_1.Result.fail(propsResult.message);
        }
        else {
            return Result_1.Result.ok(new MedicalRecordMedicalConditions({
                medicalConditions: props.medicalConditions,
            }));
        }
    }
    static createMedicalConditions(medicalConditions) {
        return medicalConditions.map(medicalCondition => new MedicalRecordMedicalConditions({ medicalConditions: [medicalCondition] }));
    }
}
exports.MedicalRecordMedicalConditions = MedicalRecordMedicalConditions;
//# sourceMappingURL=medicalRecordMedicalConditions.js.map