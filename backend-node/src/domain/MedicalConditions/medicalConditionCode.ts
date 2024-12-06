import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface MedicalConditionCodeProps{
    code: string;
}

export class MedicalConditionCode extends ValueObject<MedicalConditionCodeProps> {

    get value (): string {
        return this.props.code;
    }   

    public constructor (props: MedicalConditionCodeProps) {
        super(props);
    }

    public static create (props: MedicalConditionCodeProps): Result<MedicalConditionCode> {
        const propsResult = Guard.againstNullOrUndefined(props.code, 'code');
    
        if (!propsResult.succeeded) {
          return Result.fail<MedicalConditionCode>(propsResult.message);
        } else {
    
          return Result.ok<MedicalConditionCode>(new MedicalConditionCode({
            code: props.code,
            
          }));
        }
      }

}