import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import { Result } from "../core/logic/Result";
import IAllergyDTO from '../dto/IAllergyDTO';
import IAllergyService from '../services/IServices/IAllergyService';
import IMedicalRecordController from './IControllers/IMedicalRecordController';
import IMedicalRecordService from '../services/IServices/IMedicalRecordService';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';

@Service()
export default class MedicalRecordController implements IMedicalRecordController  {
  constructor(
      @Inject(config.services.medicalRecord.name) private medicalRecordServiceInstance : IMedicalRecordService
  ) {}


  public async getMedicalRecord(req: Request, res: Response, next: NextFunction) {
  
    try {
      const medicalRecord = await this.medicalRecordServiceInstance.getMedicalRecord(req.params.id);

      if (medicalRecord === null) {
        return res.status(404).send("Medical Record not found or error in retrieving medical record ");
      }
      return res.json(medicalRecord).status(200);
    }
    catch (err) {
      res.status(500).json({ message: err.message }); 
    }
  };


  // api/medicalRecords
  public async getAllMedicalRecords(req: Request, res: Response, next: NextFunction) {
    try {
     
      const medicalRecords = await this.medicalRecordServiceInstance.getMedicalRecords();

      if ( medicalRecords === null ) {
        return res.status(404).send("Failed to retrieve allergies");
      }

      return res.json(medicalRecords).status(200);
    }
    catch (err) {
      res.status(500).json({ message: err.message }); 
    }
  };



  // api/medicalRecords
  public async createMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecordOrError = await this.medicalRecordServiceInstance.createMedicalRecord(req.body as IMedicalRecordDTO) as Result<IMedicalRecordDTO>;
        
      if (medicalRecordOrError.isFailure) {
        return res.status(402).send("Error creating allergy");
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();
      return res.json( medicalRecordDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  // api/medicalRecords/:id
  public async updateMedicaRecord(req: Request, res: Response, next: NextFunction) {
    try {

      const { id, name, code, description } = req.body;
      console.log(`ID: ${req.params.id}`); // Log para verificar o ID
      console.log(`Name: ${name}, Code: ${code}, Description: ${description}`);

      const medicalRecordOrError = await this.medicalRecordServiceInstance.updateMedicalRecord({ id, name, code, description }) as Result<IMedicalRecordDTO>;

      if (medicalRecordOrError.isFailure) {
        console.error("Failed to update medical record:", medicalRecordOrError.error); 
        return res.status(404).send("Medical Record not found");
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();
      return res.status(200).json( medicalRecordDTO );
    }
    catch (e) {
      console.error("Error:", e);
      return next(e);
    }
  };
}