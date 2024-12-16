"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalConditionSymptoms = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Guard_1 = require("../../core/logic/Guard");
const Result_1 = require("../../core/logic/Result");
class MedicalConditionSymptoms extends ValueObject_1.ValueObject {
    get value() {
        return this.props.symptoms;
    }
    constructor(props) {
        super(props);
    }
    static create(props) {
        const propsResult = Guard_1.Guard.againstNullOrUndefined(props.symptoms, 'symptoms');
        if (!propsResult.succeeded) {
            return Result_1.Result.fail(propsResult.message);
        }
        else {
            return Result_1.Result.ok(new MedicalConditionSymptoms({
                symptoms: props.symptoms,
            }));
        }
    }
}
exports.MedicalConditionSymptoms = MedicalConditionSymptoms;
//# sourceMappingURL=medicalConditionSymptoms.js.map