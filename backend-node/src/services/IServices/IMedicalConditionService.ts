import { Result } from "../../core/logic/Result";
import IMedicalConditionDTO from "../../dto/IMedicalConditionDTO";


export default interface IMedicalConditionService  {
  createMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>>;
  updateMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>>;
  getMedicalCondition (medicalConditionId: string): Promise<Result<IMedicalConditionDTO>>;
  getMedicalConditions(): Promise<Result<IMedicalConditionDTO[]>>;
}
