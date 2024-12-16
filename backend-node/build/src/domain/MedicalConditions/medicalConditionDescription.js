"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalConditionDescription = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Guard_1 = require("../../core/logic/Guard");
const Result_1 = require("../../core/logic/Result");
class MedicalConditionDescription extends ValueObject_1.ValueObject {
    get value() {
        return this.props.description;
    }
    constructor(props) {
        super(props);
    }
    static create(props) {
        const propsResult = Guard_1.Guard.againstNullOrUndefined(props.description, 'description');
        if (!propsResult.succeeded) {
            return Result_1.Result.fail(propsResult.message);
        }
        else {
            return Result_1.Result.ok(new MedicalConditionDescription({
                description: props.description,
            }));
        }
    }
}
exports.MedicalConditionDescription = MedicalConditionDescription;
//# sourceMappingURL=medicalConditionDescription.js.map