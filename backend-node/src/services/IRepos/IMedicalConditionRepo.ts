import { Repo } from "../../core/infra/Repo";
import { MedicalCondition } from "../../domain/MedicalConditions/medicalCondition";
import { MedicalConditionId } from "../../domain/MedicalConditions/medicalConditionId";

export default interface IMedicalConditionRepo extends Repo<MedicalCondition> {
  save(medicalCondition: MedicalCondition): Promise<MedicalCondition>;
  findByDomainId (medicalConditionId: MedicalConditionId | string): Promise<MedicalCondition>;
  getAll(): Promise<MedicalCondition[]>; 
  //findByIds (rolesIds: RoleId[]): Promise<Role[]>;
  //saveCollection (roles: Role[]): Promise<Role[]>;
  //removeByRoleIds (roles: RoleId[]): Promise<any>
}