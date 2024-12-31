import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { MedicalRecordAllergies } from "./medicalRecordAllergies";
import { MedicalRecordId } from "./medicalRecordId";
import { MedicalRecordMedicalConditions } from "./medicalRecordMedicalConditions";
import { PatientMedicalRecordNumber } from "./patientMedicalRecordNumber";

interface MedicalRecordProps {
  patientMedicalRecordNumber: PatientMedicalRecordNumber;
  allergiesId: MedicalRecordAllergies[];
  medicalConditionsId: MedicalRecordMedicalConditions[];
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

        get allergiesId (): MedicalRecordAllergies[] {
            return this.props.allergiesId;
        }

        set allergiesId (value: MedicalRecordAllergies[]) {
            this.props.allergiesId = value;
        }

        get medicalConditionsId (): MedicalRecordMedicalConditions[] {
            return this.props.medicalConditionsId;
        }

        set medicalConditionsId (value: MedicalRecordMedicalConditions[]) {
            this.props.medicalConditionsId = value;
        }

      private constructor (props: MedicalRecordProps, id?: UniqueEntityID) {
        super(props, id);
      }
    
      public static create (props: MedicalRecordProps, id?: UniqueEntityID): Result<MedicalRecord> {

        const guardedProps = [
          { argument: props.patientMedicalRecordNumber, argumentName: 'patientMedicalRecordNumber' },
          { argument: props.allergiesId, argumentName: 'allergiesId' },
          { argument: props.medicalConditionsId, argumentName: 'medicalConditionsId' },
        ];
    
        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
    
        if (!guardResult.succeeded) {
          return Result.fail<MedicalRecord>(guardResult.message)
        }     
        else {
          const medicalRecord = new MedicalRecord({
            ...props
          }, id);
    
          console.log("Dentro do create:",medicalRecord)
          return Result.ok<MedicalRecord>(medicalRecord);
        }
      }
}