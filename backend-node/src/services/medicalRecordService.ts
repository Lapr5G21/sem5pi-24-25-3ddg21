import { Service, Inject } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import mongoose from 'mongoose';
import IMedicalRecordService from './IServices/IMedicalRecordService';
import IMedicalRecordRepo from './IRepos/IMedicalRecordRepo';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';
import { PatientMedicalRecordNumber } from '../domain/MedicalRecord/patientMedicalRecordNumber';
import { MedicalRecordMap } from '../mappers/MedicalRecordMap';
import { MedicalRecord } from '../domain/MedicalRecord/medicalRecord';

@Service()
export default class MedicalRecordService implements IMedicalRecordService {
  constructor(
      @Inject(config.repos.medicalRecord.name) private medicalRecordRepo : IMedicalRecordRepo) {}


  public async createMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
    try {

      const medicalRecordProps = {
        patientMedicalRecordNumber: PatientMedicalRecordNumber.create({medicalRecordNumber: medicalRecordDTO.patientMedicalRecordNumber}).getValue(),
        allergiesID: medicalRecordDTO.allergiesID, 
        medicalConditionsID: medicalRecordDTO.medicalConditionsID, 
        domainId: new mongoose.Types.ObjectId().toString(),
      };
      
      const medicalRecordOrError = await MedicalRecord.create(medicalRecordProps);
      
      if (medicalRecordOrError.isFailure) {
      return Result.fail<IMedicalRecordDTO>(medicalRecordOrError.errorValue());
      }

      const medicalRecordResult = medicalRecordOrError.getValue();

      await this.medicalRecordRepo.save(medicalRecordResult);

      const medicalRecordDTOResult = MedicalRecordMap.toDTO( medicalRecordResult ) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>( medicalRecordDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async getMedicalRecord( medicalRecordId: string): Promise<Result<IMedicalRecordDTO>> {
    try {
      const medicalRecord = await this.medicalRecordRepo.findByDomainId(medicalRecordId);

      if (medicalRecord === null) {
        return Result.fail<IMedicalRecordDTO>("Medical Record not found");
      }
      else {
        const medicalRecordDTOResult = MedicalRecordMap.toDTO( medicalRecord ) as IMedicalRecordDTO;
        return Result.ok<IMedicalRecordDTO>( medicalRecordDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

  public async getAllMedicalRecords(): Promise<Result<IMedicalRecordDTO[]>> {
    
    try {
      console.log('Entering getAllMedicalRecords service');
      const medicalRecords = await this.medicalRecordRepo.getAll();

      console.log('medicalRecords:', medicalRecords);

      const  medicalRecordsDTO = medicalRecords.map( medicalRecord => MedicalRecordMap.toDTO( medicalRecord ) as IMedicalRecordDTO );

      

      console.log('medicalRecordsDTO:', medicalRecordsDTO);
      return Result.ok<IMedicalRecordDTO[]>( medicalRecordsDTO );
    } catch (e) {
      throw e;
    }
  }

  public async updateMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
    try {
      const medicalRecord = await this.medicalRecordRepo.findByDomainId(medicalRecordDTO.id);

      if (medicalRecord === null) {
        return Result.fail<IMedicalRecordDTO>("Medical Record not found");
      }
      else {

        await this.medicalRecordRepo.save(medicalRecord);

        const medicalRecordDTOResult = MedicalRecordMap.toDTO( medicalRecord ) as IMedicalRecordDTO;
        return Result.ok<IMedicalRecordDTO>( medicalRecordDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

}
