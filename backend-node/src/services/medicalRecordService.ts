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

      const medicalConditionsID = medicalConditionsOrErrors
        .filter((result) => result.isSuccess)
        .map((result) => result.getValue());
      

      const medicalRecordProps = {
        patientMedicalRecordNumber: PatientMedicalRecordNumber.create({
          medicalRecordNumber: medicalRecordDTO.patientMedicalRecordNumber,
        }).getValue(),
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
      console.error("Erro ao buscar prontuário:", err); // Log de erro no serviço
      return Result.fail<IMedicalRecordDTO>('Error retrieving medical record');
    }
  }
  
  
  public async getAllMedicalRecords(): Promise<Result<IMedicalRecordDTO[]>> {
    try {
      const medicalRecords = await this.medicalRecordRepo.getAll();

      const medicalRecordsDTO = medicalRecords.map((medicalRecord) =>
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
      return Result.fail<IMedicalRecordDTO>("Medical Rceord not found");
    }
    
    console.log("MedicalRecordDTO:", medicalRecordDTO);

    const medicalRecordDTOOld = MedicalRecordMap.toDTO(medicalRecord.props);

    console.log("MedicalRecordDTOOld:", medicalRecordDTOOld);

    const patientMedicalRecordNumberOrError = 
    medicalRecordDTOOld.patientMedicalRecordNumber !== medicalRecordDTO.patientMedicalRecordNumber
        ? PatientMedicalRecordNumber.create({ medicalRecordNumber: medicalRecordDTO.patientMedicalRecordNumber })
        : Result.ok<PatientMedicalRecordNumber>(medicalRecord.props.patientMedicalRecordNumber);

        const allergiesInstances = MedicalRecordAllergies.createAllergies(medicalRecordDTO.allergiesId);
        const allergiesOrError = Result.ok<MedicalRecordAllergies[]>(allergiesInstances);
       
        const medicalConditionsInstances = MedicalRecordMedicalConditions.createMedicalConditions(medicalRecordDTO.medicalConditionsId);
        const medicalConditionsOrError = Result.ok<MedicalRecordMedicalConditions[]>(medicalConditionsInstances);

    const notationsOrError = 
    medicalRecordDTOOld.notations !== medicalRecordDTO.notations
        ? MedicalRecordNotations.create({ notations: medicalRecordDTO.notations })
        : Result.ok<MedicalRecordNotations>(medicalRecord.props.notations);

    if (patientMedicalRecordNumberOrError.isFailure || allergiesOrError.isFailure || medicalConditionsOrError.isFailure || notationsOrError.isFailure) {
      return Result.fail<IMedicalRecordDTO>("Invalid data provided");
    }

    if (patientMedicalRecordNumberOrError.isSuccess) medicalRecord.props.patientMedicalRecordNumber = patientMedicalRecordNumberOrError.getValue();
    console.log("patientMedicalRecord", patientMedicalRecordNumberOrError.getValue());
    if (allergiesOrError.isSuccess) medicalRecord.props.allergiesId = allergiesOrError.getValue();
    console.log("allergies", allergiesOrError.getValue());
    if (medicalConditionsOrError.isSuccess) medicalRecord.props.medicalConditionsId = medicalConditionsOrError.getValue();
    console.log("medicalConditions", medicalConditionsOrError.getValue());
    if (notationsOrError.isSuccess) medicalRecord.props.notations = notationsOrError.getValue();
    console.log("notations", notationsOrError.getValue());

    await this.medicalRecordRepo.save(medicalRecord);

    const medicalRecordDTOResult = MedicalRecordMap.toDTO(medicalRecord.props) as IMedicalRecordDTO;
    return Result.ok<IMedicalRecordDTO>(medicalRecordDTOResult);
  } catch (e) {
    console.error("Error during update:", e);
    return Result.fail<IMedicalRecordDTO>(`Error updating medical record: ${e.message}`);
  }
}



  /*
  public async updateMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
    try {
    
      const medicalRecord = await this.medicalRecordRepo.findByDomainId(medicalRecordDTO.id);

      if (medicalRecord === null) {
        return Result.fail<IMedicalRecordDTO>("Medical Record not found at Service");
      }

      console.log("MedicalRecordDTO:", medicalRecordDTO);
      console.log("MedicalRecord Before Update:", medicalRecord);

      
      const patientNumberOrError = PatientMedicalRecordNumber.create({
        medicalRecordNumber: medicalRecordDTO.patientMedicalRecordNumber,
      });

      if (patientNumberOrError.isFailure) {
        return Result.fail<IMedicalRecordDTO>(`Invalid patient number: ${patientNumberOrError.errorValue()}`);
      }

      medicalRecord.patientMedicalRecordNumber = patientNumberOrError.getValue();

      // Atualizar as alergias
      const allergiesOrErrors = medicalRecordDTO.allergiesId.map((allergyId) =>
        MedicalRecordAllergies.create({ allergies: [allergyId] })
      );

      medicalRecord.props.allergiesId = allergiesOrErrors.map((result) => result.getValue());


      // Atualizar as condições médicas
      const medicalConditionsOrErrors = medicalRecordDTO.medicalConditionsId.map((conditionId) =>
        MedicalRecordMedicalConditions.create({ medicalConditions: [conditionId] })
      );

      medicalRecord.props.medicalConditionsId = medicalConditionsOrErrors.map((result) => result.getValue());

  

      if (allergiesOrErrors.some((result) => result.isFailure)) {
        console.error("Failed to process allergies:", allergiesOrErrors.filter((result) => result.isFailure));
    }
    
      if (medicalConditionsOrErrors.some((result) => result.isFailure)) {
        console.error("Failed to process medical conditions:", medicalConditionsOrErrors.filter((result) => result.isFailure));
    }

      // Atualizar as anotações

      const notationsOrError = MedicalRecordNotations.create({ notations: medicalRecordDTO.notations });
      if (notationsOrError.isFailure) {
        return Result.fail<IMedicalRecordDTO>(`Invalid notations: ${notationsOrError.errorValue()}`);
      }

      medicalRecord.notations = notationsOrError.getValue();

      // Salvar o registro médico atualizado no repositório
      console.log("MedicalRecord Before Save:", medicalRecord);
      await this.medicalRecordRepo.save(medicalRecord);
      console.log("MedicalRecord After Save:", medicalRecord);

      // Converter para DTO e retornar o resultado
      const medicalRecordDTOResult = MedicalRecordMap.toDTO(medicalRecord) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>(medicalRecordDTOResult);
    } catch (e) {
      console.error("Error updating medical record:", e);
      throw e;
    }
  }
    */
}
