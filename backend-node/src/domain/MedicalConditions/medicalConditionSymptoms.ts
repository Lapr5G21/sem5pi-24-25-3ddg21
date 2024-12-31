import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface MedicalConditionSymptomsProps{
    symptoms: string;
}

export class MedicalConditionSymptoms extends ValueObject<MedicalConditionSymptomsProps> {

    get value (): string {
        return this.props.symptoms;
    }   

    public constructor (props: MedicalConditionSymptomsProps) {
        super(props);
    }

    public static create (props: MedicalConditionSymptomsProps): Result<MedicalConditionSymptoms> {
        const propsResult = Guard.againstNullOrUndefined(props.symptoms, 'symptoms');
    
        if ( props.symptoms.length > 2048){
          return Result.fail<MedicalConditionSymptoms>("Medical condition symptoms its too long");
        }

        if (!propsResult.succeeded) {
          return Result.fail<MedicalConditionSymptoms>(propsResult.message);
        } else {
    
          return Result.ok<MedicalConditionSymptoms>(new MedicalConditionSymptoms({
            symptoms: props.symptoms,
            
          }));
        }
      }

}