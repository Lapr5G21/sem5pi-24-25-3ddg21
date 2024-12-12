import { Repo } from "../../core/infra/Repo";
import { MedicalCondition } from "../../domain/MedicalConditions/medicalCondition";
import { MedicalConditionId } from "../../domain/MedicalConditions/medicalConditionId";
import ISearchMedicalConditionDTO from "../../../src/dto/ISearchMedicalConditionDTO";

export default interface IMedicalConditionRepo extends Repo<MedicalCondition> {
  save(medicalCondition: MedicalCondition): Promise<MedicalCondition>;
  findByDomainId (medicalConditionId: MedicalConditionId | string): Promise<MedicalCondition>;
  getAll(): Promise<MedicalCondition[]>; 
  searchMedicalConditions(searchDTO: ISearchMedicalConditionDTO): Promise<MedicalCondition[]>; 
  delete(medicalCondition: MedicalCondition): Promise<any>;
  //findByIds (rolesIds: RoleId[]): Promise<Role[]>;
  //saveCollection (roles: Role[]): Promise<Role[]>;
  //removeByRoleIds (roles: RoleId[]): Promise<any>
}