import { Repo } from "../../core/infra/Repo";
import { MedicalRecord } from "../../domain/MedicalRecord/medicalRecord";
import { MedicalRecordId } from "../../domain/MedicalRecord/medicalRecordId";


export default interface IMedicalRecordRepo extends Repo<MedicalRecord> {
  save(medicalRecord: MedicalRecord): Promise<MedicalRecord>;
  findByDomainId (medicalRecordId: MedicalRecordId | string): Promise<MedicalRecord>;
  getAll(): Promise<MedicalRecord[]>;
}