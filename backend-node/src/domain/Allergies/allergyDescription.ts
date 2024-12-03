import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface AllergyDescriptionProps{
    description: string;
}

export class AllergyDescription extends ValueObject<AllergyDescriptionProps> {

    get description (): string {
        return this.props.description;
    }   

    private constructor (props: AllergyDescriptionProps) {
        super(props);
    }

    public static create (props: AllergyDescriptionProps): Result<AllergyDescription> {
        const propsResult = Guard.againstNullOrUndefined(props.description, 'description');
    
        if (!propsResult.succeeded) {
          return Result.fail<AllergyDescription>(propsResult.message);
        } else {
    
          return Result.ok<AllergyDescription>(new AllergyDescription({
            description: props.description,
            
          }));
        }
      }

}