import { Service, Inject } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IMedicalConditionService from './IServices/IMedicalConditionService';
import IMedicalConditionRepo from './IRepos/IMedicalConditionRepo';
import IMedicalConditionDTO from '../dto/IMedicalConditionDTO';
import { MedicalConditionMap } from '../mappers/MedicalConditionMap';
import { MedicalCondition } from '../domain/MedicalConditions/medicalCondition';
import { MedicalConditionCode } from '../domain/MedicalConditions/medicalConditionCode';
import { MedicalConditionDescription } from '../domain/MedicalConditions/medicalConditionDescription';
import { MedicalConditionName } from '../domain/MedicalConditions/medicalConditionName';
import { MedicalConditionSymptoms } from '../domain/MedicalConditions/medicalConditionSymptoms';
import mongoose from 'mongoose';

@Service()
export default class MedicalConditionService implements IMedicalConditionService {
  constructor(
      @Inject(config.repos.medicalCondition.name) private medicalConditionRepo : IMedicalConditionRepo) {}


  public async createMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>> {
    try {

      const medicalConditionProps = {
        name: MedicalConditionName.create({ name: medicalConditionDTO.name }).getValue(),
        code: MedicalConditionCode.create({ code: medicalConditionDTO.code }).getValue(),
        description: MedicalConditionDescription.create({ description: medicalConditionDTO.description }).getValue(),
        symptoms: MedicalConditionSymptoms.create({ symptoms: medicalConditionDTO.symptoms }).getValue(),
        domainId: new mongoose.Types.ObjectId().toString(),
      };
      const medicalConditionOrError = await MedicalCondition.create( medicalConditionProps );

      if (medicalConditionOrError.isFailure) {
        return Result.fail<IMedicalConditionDTO>(medicalConditionOrError.errorValue());
      }

      const medicalConditionResult = medicalConditionOrError.getValue();

      await this.medicalConditionRepo.save(medicalConditionResult);

      const medicalConditionDTOResult = MedicalConditionMap.toDTO(medicalConditionResult ) as IMedicalConditionDTO;
      return Result.ok<IMedicalConditionDTO>( medicalConditionDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async getMedicalCondition( medicalConditionId: string): Promise<Result<IMedicalConditionDTO>> {
    try {
      const medicalCondition = await this.medicalConditionRepo.findByDomainId(medicalConditionId);

      if (medicalCondition === null) {
        return Result.fail<IMedicalConditionDTO>("Medical Condition not found");
      }
      else {
        const medicalConditionDTOResult = MedicalConditionMap.toDTO( medicalCondition ) as IMedicalConditionDTO;
        return Result.ok<IMedicalConditionDTO>( medicalConditionDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

  public async getMedicalConditions(): Promise<Result<IMedicalConditionDTO[]>> {
    try {
      const medicalConditions = await this.medicalConditionRepo.getAll();

      const medicalConditionsDTO = medicalConditions.map( medicalCondition => MedicalConditionMap.toDTO( medicalCondition ) as IMedicalConditionDTO );

      return Result.ok<IMedicalConditionDTO[]>( medicalConditionsDTO );
    } catch (e) {
      throw e;
    }
  }

  public async updateMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>> {
    try {
      const medicalCondition = await this.medicalConditionRepo.findByDomainId(medicalConditionDTO.id);

      if (medicalCondition === null) {
        return Result.fail<IMedicalConditionDTO>("Medical Condition not found");
      }
      else {
        const name  = MedicalConditionName.create( { name: medicalConditionDTO.name } ) ;
        const code = MedicalConditionCode.create( { code : medicalConditionDTO.code } );
        const description = MedicalConditionDescription.create( { description : medicalConditionDTO.description } );
        const symptoms = MedicalConditionSymptoms.create( { symptoms : medicalConditionDTO.description } );

        medicalCondition.name = name.getValue();
        medicalCondition.code = code.getValue();
        medicalCondition.description = description.getValue();
        medicalCondition.symptoms = symptoms.getValue();

        await this.medicalConditionRepo.save(medicalCondition);

        const medicalConditionDTOResult = MedicalConditionMap.toDTO( medicalCondition ) as IMedicalConditionDTO;
        return Result.ok<IMedicalConditionDTO>( medicalConditionDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

}
