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
import { MedicalRecordAllergies } from '../domain/MedicalRecord/medicalRecordAllergies';
import { MedicalRecordMedicalConditions } from '../domain/MedicalRecord/medicalRecordMedicalConditions';
import { MedicalRecordNotations } from '../domain/MedicalRecord/medicalRecordNotations';

@Service()
export default class MedicalRecordService implements IMedicalRecordService {
  constructor(
    @Inject(config.repos.medicalRecord.name) private medicalRecordRepo: IMedicalRecordRepo) { }


  public async createMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
    try {

      const allergiesOrErrors = medicalRecordDTO.allergiesId.map((allergyId) =>
        MedicalRecordAllergies.create({ allergies: [allergyId] })
      );

      const invalidAllergies = allergiesOrErrors.find((result) => result.isFailure);
      if (invalidAllergies) {
        return Result.fail<IMedicalRecordDTO>(`Error creating allergies: ${invalidAllergies.errorValue()}`);
      }

      const allergiesID = allergiesOrErrors.map((result) => result.getValue());


      const medicalConditionsOrErrors = medicalRecordDTO.medicalConditionsId.map((conditionId) =>
        MedicalRecordMedicalConditions.create({ medicalConditions: [conditionId] })
      );

      const invalidConditions = medicalConditionsOrErrors.find((result) => result.isFailure);
      if (invalidConditions) {
        return Result.fail<IMedicalRecordDTO>(`Error creating medical conditions: ${invalidConditions.errorValue()}`);
      }

      const medicalConditionsID = medicalConditionsOrErrors.map((result) => result.getValue());
      
      const medicalRecordProps = {
        patientMedicalRecordNumber: PatientMedicalRecordNumber.create({
        patientMedicalRecordNumber: medicalRecordDTO.patientMedicalRecordNumber,}).getValue(),
        allergiesId: allergiesID,
        medicalConditionsId: medicalConditionsID,
        notations: MedicalRecordNotations.create({ notations: medicalRecordDTO.notations,}).getValue(),
      };

      const medicalRecordOrError = MedicalRecord.create(medicalRecordProps);

      if (medicalRecordOrError.isFailure) {
        return Result.fail<IMedicalRecordDTO>(medicalRecordOrError.errorValue());
      }

      const medicalRecordResult = medicalRecordOrError.getValue();
      await this.medicalRecordRepo.save(medicalRecordResult);

      const medicalRecordDTOResult = MedicalRecordMap.toDTO(medicalRecordResult) as IMedicalRecordDTO;

      return Result.ok<IMedicalRecordDTO>(medicalRecordDTOResult);
    } catch (e) {
      console.error("Error creating medical record:", e);
      throw e;
    }
  }

  public async getMedicalRecord(medicalRecordId: string): Promise<Result<IMedicalRecordDTO>> {
    try {
      const medicalRecord = await this.medicalRecordRepo.findByDomainId(medicalRecordId);
      
      if (!medicalRecord) {
        return Result.fail<IMedicalRecordDTO>("Medical Record not found");
      }

      const medicalRecordDTOResult = MedicalRecordMap.toDTO(medicalRecord) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>(medicalRecordDTOResult);
    } catch (e) {
      throw e;
    }
  }

  public async getByPatientMedicalRecordNumber(patientMedicalRecordNumber: string): Promise<Result<IMedicalRecordDTO>> {
    try {
      const medicalRecord = await this.medicalRecordRepo.findByPatientMedicalRecordNumber(patientMedicalRecordNumber);

      if (!medicalRecord) {
        return Result.fail<IMedicalRecordDTO>('Medical record not found');
      }
  
      return Result.ok<IMedicalRecordDTO>(MedicalRecordMap.toDTO(medicalRecord));
    } catch (err) {
      console.error("Medical record not found:", err);
      return Result.fail<IMedicalRecordDTO>('Error retrieving medical record');
    }
  }
  
  
  public async getAllMedicalRecords(): Promise<Result<IMedicalRecordDTO[]>> {
    try {
      const medicalRecords = await this.medicalRecordRepo.getAll();
      const medicalRecordsDTO = medicalRecords.map(medicalRecord =>
        MedicalRecordMap.toDTO(medicalRecord) as IMedicalRecordDTO
      );

      return Result.ok<IMedicalRecordDTO[]>(medicalRecordsDTO);
    } catch (e) {
      throw e;
    }
  }


  public async updateMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
    try {
    
      const medicalRecord = await this.medicalRecordRepo.findByDomainId(medicalRecordDTO.id);

      if (medicalRecord === null) {
        return Result.fail<IMedicalRecordDTO>("Medical Record not found at Service");
      }
    
      const patientNumberOrError = PatientMedicalRecordNumber.create({
        patientMedicalRecordNumber: medicalRecordDTO.patientMedicalRecordNumber,
      });

      if (patientNumberOrError.isFailure) {
        return Result.fail<IMedicalRecordDTO>(`Invalid patient number: ${patientNumberOrError.errorValue()}`);
      }

      medicalRecord.patientMedicalRecordNumber = patientNumberOrError.getValue();

      const allergiesOrErrors = medicalRecordDTO.allergiesId.map((allergyId) =>
        MedicalRecordAllergies.create({ allergies: [allergyId] })
      );

      const invalidAllergies = allergiesOrErrors.find((result) => result.isFailure);
      if (invalidAllergies) {
        return Result.fail<IMedicalRecordDTO>(`Error updating allergies: ${invalidAllergies.errorValue()}`);
      }

      const allergiesID = allergiesOrErrors.map((result) => result.getValue());
      medicalRecord.allergiesId = allergiesID;

      const medicalConditionsOrErrors = medicalRecordDTO.medicalConditionsId.map((conditionId) =>
        MedicalRecordMedicalConditions.create({ medicalConditions: [conditionId] })
      );

      const invalidConditions = medicalConditionsOrErrors.find((result) => result.isFailure);
      if (invalidConditions) {
        return Result.fail<IMedicalRecordDTO>(`Error updating medical conditions: ${invalidConditions.errorValue()}`);
      }

      const medicalConditionsID = medicalConditionsOrErrors.map((result) => result.getValue());
      medicalRecord.medicalConditionsId = medicalConditionsID;

      const notationsOrError = MedicalRecordNotations.create({ notations: medicalRecordDTO.notations });
      if (notationsOrError.isFailure) {
        return Result.fail<IMedicalRecordDTO>(`Invalid notations: ${notationsOrError.errorValue()}`);
      }

      medicalRecord.notations = notationsOrError.getValue();
      await this.medicalRecordRepo.save(medicalRecord);

      const medicalRecordDTOResult = MedicalRecordMap.toDTO(medicalRecord) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>(medicalRecordDTOResult);
    } catch (e) {
      console.error("Error updating medical record:", e);
      throw e;
    }
  }
  
}
