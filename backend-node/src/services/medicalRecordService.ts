import { Service, Inject } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IAllergyService from './IServices/IAllergyService';
import IAllergyRepo from './IRepos/IAllergyRepo';
import IAllergyDTO from '../dto/IAllergyDTO';
import { AllergyMap } from '../mappers/AllergyMap';
import { Allergy } from '../domain/Allergies/allergy';
import { AllergyCode } from '../domain/Allergies/allergyCode';
import { AllergyDescription } from '../domain/Allergies/allergyDescription';
import { AllergyName } from '../domain/Allergies/allergyName';
import mongoose from 'mongoose';
import IMedicalRecordService from './IServices/IMedicalRecordService';
import IMedicalRecordRepo from './IRepos/IMedicalRecordRepo';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';
import { PatientMedicalRecordNumber } from '../domain/MedicalRecord/patientMedicalRecordNumber';
import { MedicalRecordMap } from '../mappers/MedicalRecordMap';
import { MedicalRecord } from '../domain/MedicalRecord/medicalRecord';
import { MedicalConditionMap } from '../mappers/MedicalConditionMap';

@Service()
export default class MedicalRecordService implements IMedicalRecordService {
  constructor(
      @Inject(config.repos.medicalRecord.name) private medicalRecordRepo : IMedicalRecordRepo) {}


  public async createMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
    try {

      const medicalRecordProps = {
        domainId: new mongoose.Types.ObjectId().toString(),
        patientMedicalRecordNumber: PatientMedicalRecordNumber.create({ medicalRecordNumber: medicalRecordDTO.patientMedicalRecordNumber.toString() }).getValue(),
        allergies: medicalRecordDTO.allergies.map(a => AllergyMap.toDomain(a)),
        medicalConditions: medicalRecordDTO.medicalConditions.map(mc => MedicalConditionMap.toDomain(mc)),
        medicalHistory: medicalRecordDTO.medicalHistory.map(mh => mh.toString())
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
      const medicalRecords = await this.medicalRecordRepo.getAll();

      const  medicalRecordsDTO = medicalRecords.map( medicalRecords => MedicalRecordMap.toDTO( medicalRecords ) as IMedicalRecordDTO );

      return Result.ok<IMedicalRecordDTO[]>( medicalRecordsDTO );
    } catch (e) {
      throw e;
    }
  }

  public async updateMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
    try {
      const medicalRecord = await this.medicalRecordRepo.findByDomainId(medicalRecordDTO.DomainId);

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
