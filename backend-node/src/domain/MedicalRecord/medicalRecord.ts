import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { MedicalRecordId } from "./medicalRecordId";
import { PatientMedicalRecordNumber } from "./patientMedicalRecordNumber";

interface MedicalRecordProps {
  patientMedicalRecordNumber: PatientMedicalRecordNumber;
  allergiesID: String[];
  medicalConditionsID: String[];
}

export class MedicalRecord extends AggregateRoot<MedicalRecordProps> {

    get id (): UniqueEntityID {
        return this._id;
      }
    

      get medicalRecordId (): MedicalRecordId {
        return new MedicalRecordId(this.medicalRecordId.toValue());
      }

        get patientMedicalRecordNumber (): PatientMedicalRecordNumber {
            return this.props.patientMedicalRecordNumber;
        }

        set patientMedicalRecordNumber (value: PatientMedicalRecordNumber) {
            this.props.patientMedicalRecordNumber = value;
        }

        get allergiesID (): String[] {
            return this.props.allergiesID;
        }

        set allergiesID (value: String[]) {
            this.props.allergiesID = value;
        }

        get medicalConditionsID (): String[] {
            return this.props.medicalConditionsID;
        }

        set medicalConditionsID (value: String[]) {
            this.props.medicalConditionsID = value;
        }

      private constructor (props: MedicalRecordProps, id?: UniqueEntityID) {
        super(props, id);
      }
    
      public static create (props: MedicalRecordProps, id?: UniqueEntityID): Result<MedicalRecord> {

        const guardedProps = [
          { argument: props.patientMedicalRecordNumber, argumentName: 'patientMedicalRecordNumber' },
          { argument: props.allergiesID, argumentName: 'allergiesID' },
          { argument: props.medicalConditionsID, argumentName: 'medicalConditionsID' },
        ];
    
        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
    
        if (!guardResult.succeeded) {
          return Result.fail<MedicalRecord>(guardResult.message)
        }     
        else {
          const medicalRecord = new MedicalRecord({
            ...props
          }, id);
    
          return Result.ok<MedicalRecord>(medicalRecord);
        }
      }
}