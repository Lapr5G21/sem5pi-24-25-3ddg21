import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface PatientMedicalRecordNumberProps{
    medicalRecordNumber: string;
}

export class PatientMedicalRecordNumber extends ValueObject<PatientMedicalRecordNumberProps> {

    get value (): string {
        return this.props.medicalRecordNumber;
    }   

    public constructor (props: PatientMedicalRecordNumberProps) {
        super(props);
    }

    public static create (props: PatientMedicalRecordNumberProps): Result<PatientMedicalRecordNumber> {
        const propsResult = Guard.againstNullOrUndefined(props.medicalRecordNumber, 'medicalRecordNumber');
    
        if (!propsResult.succeeded) {
          return Result.fail<PatientMedicalRecordNumber>(propsResult.message);
        } else {
    
          return Result.ok<PatientMedicalRecordNumber>(new PatientMedicalRecordNumber({
            medicalRecordNumber: props.medicalRecordNumber,
            
          }));
        }
      }

}