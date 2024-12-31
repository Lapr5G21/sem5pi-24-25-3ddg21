import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface AllergyDescriptionProps{
    description: string;
}

export class AllergyDescription extends ValueObject<AllergyDescriptionProps> {

    get value (): string {
        return this.props.description;
    }   

    public constructor (props: AllergyDescriptionProps) {
        super(props);
    }

    public static create (props: AllergyDescriptionProps): Result<AllergyDescription> {
        const propsResult = Guard.againstNullOrUndefined(props.description, 'description');
    
        if ( props.description.length > 2048) {
            return Result.fail<AllergyDescription>("Allergy description its too long");
        }

        if (!propsResult.succeeded) {
          return Result.fail<AllergyDescription>(propsResult.message);
        } else {
    
          return Result.ok<AllergyDescription>(new AllergyDescription({
            description: props.description,
            
          }));
        }
      }

}