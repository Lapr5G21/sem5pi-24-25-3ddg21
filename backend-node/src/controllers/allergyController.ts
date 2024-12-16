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
    @Inject(config.services.allergy.name) private allergyServiceInstance : IAllergyService
) {}
      
  public async getAllergy(req: Request, res: Response, next: NextFunction) {
  
    try {
      const allergy = await this.allergyServiceInstance.getAllergy(req.params.id);

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
     

      const allergies = await this.allergyServiceInstance.getAllAllergies();
     
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
      const allergyOrError = await this.allergyServiceInstance.createAllergy(req.body as IAllergyDTO) as Result<IAllergyDTO>;
        
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
    try {
      const allergyOrError = await this.allergyServiceInstance.deleteAllergy(req.params.id) as Result<IAllergyDTO>;

      if (allergyOrError.isFailure) {
        return res.status(404).json({ message: "Morreu aqui" });
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
      console.log("Request body: ", req.body);
      const allergyOrError = await this.allergyServiceInstance.updateAllergy(req.body as IAllergyDTO) as Result<IAllergyDTO>;

      if (allergyOrError.isFailure) {
        
        return res.status(404).send("Allergy not found");
      }

      const allergyDTO = allergyOrError.getValue();
      return res.status(201).json( allergyDTO );
    }
    catch (e) {
      console.error("Error:", e);
      return next(e);
    }
  };
}