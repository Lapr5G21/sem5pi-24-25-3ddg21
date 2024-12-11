import { Result } from "../../core/logic/Result";
import IAllergyDTO from "../../dto/IAllergyDTO";


export default interface IAllergyService  {
  createAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>>;
  updateAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>>;
  getAllergy (allergyId: string): Promise<Result<IAllergyDTO>>;
  getAllAllergies(): Promise<Result<IAllergyDTO[]>>;
}
