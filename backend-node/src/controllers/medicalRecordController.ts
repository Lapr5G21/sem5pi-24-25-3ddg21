import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import { Result } from "../core/logic/Result";
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
     
      console.log('Entering getAllMedicalRecords controller');
      const result = await this.medicalRecordServiceInstance.getAllMedicalRecords();

      if ( result === null ) {
        return res.status(404).send("Failed to retrieve medical records");
      }
      
      const medicalRecordsDTO = result.getValue();

      return res.json(medicalRecordsDTO).status(200);
    } catch (err) {
      res.status(500).json({ message: err.message }); 
    }
  };



  // api/medicalRecords
  public async createMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecordOrError = await this.medicalRecordServiceInstance.createMedicalRecord(req.body as IMedicalRecordDTO) as Result<IMedicalRecordDTO>;
        
      if (medicalRecordOrError.isFailure) {
        return res.status(402).send("Error creating medicalRecord");
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();
      return res.json( medicalRecordDTO ).status(201);
    }
    catch (e) {
      console.error('Error creating medical record:', e); 
      return next(e);
    }
  };

  // api/medicalRecords/:id
  public async updateMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {

      const medicalRecordOrError = await this.medicalRecordServiceInstance.updateMedicalRecord(req.body as IMedicalRecordDTO) as Result<IMedicalRecordDTO>;

      if (medicalRecordOrError.isFailure) {
        
        return res.status(404).send("Medical Record not found");
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();
      return res.status(201).json( medicalRecordDTO );
    }
    catch (e) {
      return next(e);
    }
  };
}