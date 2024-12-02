import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import IAllergyDTO from "../../dto/IAllergyDTO";
import { AllergyId } from "./allergyId";


interface AllergyProps {
  name: string;
}

export class Allergy extends AggregateRoot<AllergyProps> {

    get id (): UniqueEntityID {
        return this._id;
      }
    
      get allergyId (): AllergyId {
        return new AllergyId(this.allergyId.toValue());
      }
    
      get name (): string {
        return this.props.name;
      }
    
      set name ( value: string) {
        this.props.name = value;
      }
      private constructor (props: AllergyProps, id?: UniqueEntityID) {
        super(props, id);
      }
    
      public static create (AllergyDTO: IAllergyDTO, id?: UniqueEntityID): Result<Allergy> {
        const name = AllergyDTO.name;
    
        if (!!name === false || name.length === 0) {
          return Result.fail<Allergy>('Must provide an allergy name')
        } else {
          const allergy = new Allergy({ name: name }, id);
          return Result.ok<Allergy>( allergy )
        }
      }





}