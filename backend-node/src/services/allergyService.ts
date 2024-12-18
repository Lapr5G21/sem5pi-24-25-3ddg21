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

@Service()
export default class AllergyService implements IAllergyService {
  constructor(
      @Inject(config.repos.allergy.name) private allergyRepo : IAllergyRepo) {}


  public async createAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>> {
    try {

      const allergyProps = {
        name: AllergyName.create({ name: allergyDTO.name }).getValue(),
        code: AllergyCode.create({ code: allergyDTO.code }).getValue(),
        description: AllergyDescription.create({ description: allergyDTO.description }).getValue(),
        domainId: new mongoose.Types.ObjectId().toString(),
      };
      
      const allergyOrError = await Allergy.create(allergyProps);
      
      if (allergyOrError.isFailure) {
      return Result.fail<IAllergyDTO>(allergyOrError.errorValue());
      }

      const allergyResult = allergyOrError.getValue();

      await this.allergyRepo.save(allergyResult);

      const allergyDTOResult = AllergyMap.toDTO( allergyResult ) as IAllergyDTO;
      return Result.ok<IAllergyDTO>( allergyDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async deleteAllergy(id: string): Promise<Result<IAllergyDTO>> {
    try {
      const allergy = await this.allergyRepo.findByDomainId(id);

      if (allergy === null) {
        return Result.fail<IAllergyDTO>("Allergy not found");
      }
      else {
        await this.allergyRepo.delete(allergy);

        const allergyDTOResult = AllergyMap.toDTO( allergy ) as IAllergyDTO;
        return Result.ok<IAllergyDTO>( allergyDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

  public async getAllergy( allergyId: string): Promise<Result<IAllergyDTO>> {
    try {
      const allergy = await this.allergyRepo.findByDomainId(allergyId);

      if (allergy === null) {
        return Result.fail<IAllergyDTO>("Allergy not found");
      }
      else {
        const allergyDTOResult = AllergyMap.toDTO( allergy ) as IAllergyDTO;
        return Result.ok<IAllergyDTO>( allergyDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

  public async getAllAllergies(): Promise<Result<IAllergyDTO[]>> {
    try {
      const allergies = await this.allergyRepo.getAll();

      const allergiesDTO = allergies.map( allergy => AllergyMap.toDTO( allergy ) as IAllergyDTO );

      return Result.ok<IAllergyDTO[]>( allergiesDTO );
    } catch (e) {
      throw e;
    }
  }

  public async updateAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>> {
    try {
      

      const allergy = await this.allergyRepo.findByDomainId(allergyDTO.id);

      
  
      if (allergy === null) {
        return Result.fail<IAllergyDTO>("allergy not found");
      }
      
  
      const allerdyDTOId = AllergyMap.toDTO(allergy.props);
  
      const nameOrError = 
      allerdyDTOId.name !== allergyDTO.name
          ? AllergyName.create({ name: allergyDTO.name })
          : Result.ok<AllergyName>(allergy.props.name);
  
      const codeOrError = 
      allerdyDTOId.code !== allergyDTO.code
          ? AllergyCode.create({ code: allergyDTO.code })
          : Result.ok<AllergyCode>(allergy.props.code);
  

      const descriptionOrError = 
      allerdyDTOId.description !== allergyDTO.description
          ? AllergyDescription.create({ description: allergyDTO.description })
          : Result.ok<AllergyDescription>(allergy.props.description);
  
      if (nameOrError.isFailure || codeOrError.isFailure || descriptionOrError.isFailure) {
        return Result.fail<IAllergyDTO>("Invalid data provided");
      }
  
      if (nameOrError.isSuccess){ allergy.props.name = nameOrError.getValue();}
      
      if (codeOrError.isSuccess){ allergy.props.code = codeOrError.getValue();}
      
      if (descriptionOrError.isSuccess){allergy.props.description = descriptionOrError.getValue();}
     
  
      console.log("Allergy FINALLLLLLLLLv ", allergy);

      await this.allergyRepo.save(allergy);
  
      const allergyDTOResult = AllergyMap.toDTO(allergy.props) as IAllergyDTO;
      
      return Result.ok<IAllergyDTO>(allergyDTOResult);
    } catch (e) {
      console.error("Error during update:", e);
      return Result.fail<IAllergyDTO>(`Error updating allergy: ${e.message}`);
    }
  }

}
