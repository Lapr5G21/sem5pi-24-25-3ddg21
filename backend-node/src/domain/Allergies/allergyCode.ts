import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface AllergyCodeProps{
    code: string;
}

export class AllergyCode extends ValueObject<AllergyCodeProps> {

    get value (): string {
        return this.props.code;
    }   

    public constructor (props: AllergyCodeProps) {
        super(props);
    }

    public static create (props: AllergyCodeProps): Result<AllergyCode> {
        const propsResult = Guard.againstNullOrUndefined(props.code, 'code');

        if ( props.code.length > 7 && props.code.length < 6) {
            return Result.fail<AllergyCode>("Allergy code must be 6 or 7 characters long");
        }
    
        if (!propsResult.succeeded) {
          return Result.fail<AllergyCode>(propsResult.message);
        } else {
    
          return Result.ok<AllergyCode>(new AllergyCode({
            code: props.code,
            
          }));
        }
      }

}