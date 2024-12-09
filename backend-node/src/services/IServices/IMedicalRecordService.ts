import { Result } from "../../core/logic/Result";
import IMedicalRecordDTO from "../../dto/IMedicalRecordDTO";



export default interface IMedicalRecordService  {
  createMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>>;
  updateMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>>;
  getMedicalRecord (medicalRecordDTO: string): Promise<Result<IMedicalRecordDTO>>;
  getAllMedicalRecords(): Promise<Result<IMedicalRecordDTO[]>>;
}
