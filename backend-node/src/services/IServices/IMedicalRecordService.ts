import { Result } from "../../core/logic/Result";
import IMedicalRecordDTO from "../../dto/IMedicalRecordDTO";



export default interface IMedicalRecordService  {
  getByPatientMedicalRecordNumber(patientMedicalRecordNumber: string): Promise<Result<IMedicalRecordDTO>>;
  createMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>>;
  updateMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>>;
  getMedicalRecord (medicalRecordDTO: string): Promise<Result<IMedicalRecordDTO>>;
  getAllMedicalRecords(): Promise<Result<IMedicalRecordDTO[]>>;
}
