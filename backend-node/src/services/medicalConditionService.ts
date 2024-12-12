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
import ISearchMedicalConditionDTO from "../dto/ISearchMedicalConditionDTO";

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

  public async searchMedicalConditions(searchDTO: ISearchMedicalConditionDTO): Promise<Result<IMedicalConditionDTO[]>> {
    try {
      const medicalConditions = await this.medicalConditionRepo.searchMedicalConditions(searchDTO);
      
      if (medicalConditions.length === 0) {
        console.log("No medical conditions found in service.");
        return Result.fail<IMedicalConditionDTO[]>(`No medical conditions found for the given search parameters.`);
      }
  
      const medicalConditionsDTO = medicalConditions.map(medicalCondition =>
        MedicalConditionMap.toDTO(medicalCondition) as IMedicalConditionDTO
      );
    
      return Result.ok<IMedicalConditionDTO[]>(medicalConditionsDTO);
    } catch (e) {
      console.error("Error during search in service:", e);
      return Result.fail<IMedicalConditionDTO[]>(`Error searching medical conditions: ${e.message}`);
    }
  }
  
  
  

 public async updateMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>> {
  try {
    const medicalCondition = await this.medicalConditionRepo.findByDomainId(medicalConditionDTO.id);

    if (medicalCondition === null) {
      return Result.fail<IMedicalConditionDTO>("Medical Condition not found");
    }
    console.log("Objeto", medicalCondition);

    const medicalConditionDTOOld = MedicalConditionMap.toDTO(medicalCondition.props);

    const nameOrError = 
      medicalConditionDTOOld.name !== medicalConditionDTO.name
        ? MedicalConditionName.create({ name: medicalConditionDTO.name })
        : Result.ok<MedicalConditionName>(medicalCondition.props.name);

    const codeOrError = 
      medicalConditionDTOOld.code !== medicalConditionDTO.code
        ? MedicalConditionCode.create({ code: medicalConditionDTO.code })
        : Result.ok<MedicalConditionCode>(medicalCondition.props.code);

    const descriptionOrError = 
      medicalConditionDTOOld.description !== medicalConditionDTO.description
        ? MedicalConditionDescription.create({ description: medicalConditionDTO.description })
        : Result.ok<MedicalConditionDescription>(medicalCondition.props.description);

    const symptomsOrError = 
      medicalConditionDTOOld.symptoms !== medicalConditionDTO.symptoms
        ? MedicalConditionSymptoms.create({ symptoms: medicalConditionDTO.symptoms })
        : Result.ok<MedicalConditionSymptoms>(medicalCondition.props.symptoms);

    if (nameOrError.isFailure || codeOrError.isFailure || descriptionOrError.isFailure || symptomsOrError.isFailure) {
      return Result.fail<IMedicalConditionDTO>("Invalid data provided");
    }

    if (nameOrError.isSuccess) medicalCondition.props.name = nameOrError.getValue();
    if (codeOrError.isSuccess) medicalCondition.props.code = codeOrError.getValue();
    if (descriptionOrError.isSuccess) medicalCondition.props.description = descriptionOrError.getValue();
    if (symptomsOrError.isSuccess) medicalCondition.props.symptoms = symptomsOrError.getValue();

    await this.medicalConditionRepo.save(medicalCondition);

    const medicalConditionDTOResult = MedicalConditionMap.toDTO(medicalCondition.props) as IMedicalConditionDTO;
    return Result.ok<IMedicalConditionDTO>(medicalConditionDTOResult);
  } catch (e) {
    console.error("Error during update:", e);
    return Result.fail<IMedicalConditionDTO>(`Error updating medical condition: ${e.message}`);
  }
}

public async deleteMedicalCondition(id: string): Promise<Result<IMedicalConditionDTO>> {
  try {
    const allergy = await this.medicalConditionRepo.findByDomainId(id);

    if (allergy === null) {
      return Result.fail<IMedicalConditionDTO>("Medical condition not found");
    }
    else {
      await this.medicalConditionRepo.delete(allergy);

      const allergyDTOResult = MedicalConditionMap.toDTO( allergy ) as IMedicalConditionDTO;
      return Result.ok<IMedicalConditionDTO>( allergyDTOResult )
      }
  } catch (e) {
    throw e;
  }
} 
  
  
}
