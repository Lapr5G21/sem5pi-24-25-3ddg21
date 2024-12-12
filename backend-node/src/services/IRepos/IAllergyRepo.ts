import { Repo } from "../../core/infra/Repo";
import { Allergy } from "../../domain/Allergies/allergy";
import { AllergyId } from "../../domain/Allergies/allergyId";
import IAllergyDTO from "../../dto/IAllergyDTO";

export default interface IAllergyRepo extends Repo<Allergy> {
  save(allergy: Allergy): Promise<Allergy>;
  findByDomainId (allergyId: AllergyId | string): Promise<Allergy>;
  getAll(): Promise<Allergy[]>;
  exists(allergy: Allergy): Promise<boolean>;
  delete(allergy: Allergy): Promise<any>;
  //findByIds (rolesIds: RoleId[]): Promise<Role[]>;
  //saveCollection (roles: Role[]): Promise<Role[]>;
  //removeByRoleIds (roles: RoleId[]): Promise<any>
}