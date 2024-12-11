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
        return Result.fail<IAllergyDTO>("Allergy not found");
      }
      else {
        const name  = AllergyName.create( { name: allergyDTO.name } ) ;
        const code = AllergyCode.create( { code : allergyDTO.code } );
        const description = AllergyDescription.create( { description : allergyDTO.description } );

        allergy.name = name.getValue();
        allergy.code = code.getValue();
        allergy.description = description.getValue();

        await this.allergyRepo.save(allergy);

        const allergyDTOResult = AllergyMap.toDTO( allergy ) as IAllergyDTO;
        return Result.ok<IAllergyDTO>( allergyDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

}
