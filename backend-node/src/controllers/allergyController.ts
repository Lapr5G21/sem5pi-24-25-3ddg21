import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import { Result } from "../core/logic/Result";

import IAllergyController from './IControllers/IAllergyController';
import IAllergyDTO from '../dto/IAllergyDTO';
import IAllergyService from '../services/IServices/IAllergyService';
import { Console } from 'console';

@Service()
export default class AllergyController implements IAllergyController  {
  constructor(
    @Inject(config.services.allergy.name) private AllergyService : IAllergyService
) {}
      
  public async getAllergy(req: Request, res: Response, next: NextFunction) {
  
    try {
      const allergy = await this.AllergyService.getAllergy(req.params.id);

      if (allergy === null) {
        return res.status(404).send("Allergy not found or error in retrieving allergy");
      }
      return res.json(allergy).status(200);
    }
    catch (err) {
      res.status(500).json({ message: err.message }); 
    }
  };


  
  public async getAllAllergies(req: Request, res: Response, next: NextFunction) {
    try {
     

      const allergies = await this.AllergyService.getAllAllergies();
     
      if ( allergies.isFailure ) {
        return res.status(404).json({message:"Failed to retrieve allergies"});
      }

      const allergiesDTO = allergies.getValue();

      return res.status(200).json(allergiesDTO);
    }
    catch (err) {
      res.status(500).json({ message: err.message }); 
    }
  };



  
  public async createAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const allergyOrError = await this.AllergyService.createAllergy(req.body as IAllergyDTO) as Result<IAllergyDTO>;
        
      if (allergyOrError.isFailure) {
        return res.status(402).send("Error creating allergy");
      }

      const allergyDTO = allergyOrError.getValue();
      return res.json( allergyDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  public async deleteAllergy(req: Request, res: Response, next: NextFunction) {
    console.log("DELETE request received for allergy:", req.params.code);
    try {
      const allergyOrError = await this.AllergyService.deleteAllergy(req.params.code) as Result<IAllergyDTO>;

      if (allergyOrError.isFailure) {
        console.log("Allergy not found");
        return res.status(404).json({ message: "Allergy not found" });
    }

      const allergyDTO = allergyOrError.getValue();

      return res.status(200).json( allergyDTO );
    }
    catch (e) {
      console.error("Error deleting allergy:", e);
        return next(e);
    }
  };

  
  public async updateAllergy(req: Request, res: Response, next: NextFunction) {
    try {

      const { id, name, code, description } = req.body;
      console.log(`ID: ${req.params.id}`); 
      console.log(`Name: ${name}, Code: ${code}, Description: ${description}`);

      const allergyOrError = await this.AllergyService.updateAllergy({ id, name, code, description }) as Result<IAllergyDTO>;

      if (allergyOrError.isFailure) {
        console.error("Failed to update allergy:", allergyOrError.error); 
        return res.status(404).send("Allergy not found");
      }

      const allergyDTO = allergyOrError.getValue();
      return res.status(200).json( allergyDTO );
    }
    catch (e) {
      console.error("Error:", e);
      return next(e);
    }
  };
}