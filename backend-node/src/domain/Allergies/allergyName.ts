import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface AllergyNameProps{
    name: string;
}

export class AllergyName extends ValueObject<AllergyNameProps> {

    get value (): string {
        return this.props.name;
    }   

    public constructor (props: AllergyNameProps) {
        super(props);
    }

    public static create (props: AllergyNameProps): Result<AllergyName> {
        const propsResult = Guard.againstNullOrUndefined(props.name, 'name');
    
        if (!propsResult.succeeded) {
          return Result.fail<AllergyName>(propsResult.message);
        } else {
    
          return Result.ok<AllergyName>(new AllergyName({
            name: props.name,
            
          }));
        }
      }

}