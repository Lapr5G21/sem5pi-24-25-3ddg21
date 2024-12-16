"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllergyName = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Guard_1 = require("../../core/logic/Guard");
const Result_1 = require("../../core/logic/Result");
class AllergyName extends ValueObject_1.ValueObject {
    get value() {
        return this.props.name;
    }
    constructor(props) {
        super(props);
    }
    static create(props) {
        const propsResult = Guard_1.Guard.againstNullOrUndefined(props.name, 'name');
        if (props.name.length > 60) {
            return Result_1.Result.fail("Allergy name its too long");
        }
        if (!propsResult.succeeded) {
            return Result_1.Result.fail(propsResult.message);
        }
        else {
            return Result_1.Result.ok(new AllergyName({
                name: props.name,
            }));
        }
    }
}
exports.AllergyName = AllergyName;
//# sourceMappingURL=allergyName.js.map