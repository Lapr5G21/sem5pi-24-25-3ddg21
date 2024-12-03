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

    private constructor (props: AllergyCodeProps) {
        super(props);
    }

    public static create (props: AllergyCodeProps): Result<AllergyCode> {
        const propsResult = Guard.againstNullOrUndefined(props.code, 'code');
    
        if (!propsResult.succeeded) {
          return Result.fail<AllergyCode>(propsResult.message);
        } else {
    
          return Result.ok<AllergyCode>(new AllergyCode({
            code: props.code,
            
          }));
        }
      }

}