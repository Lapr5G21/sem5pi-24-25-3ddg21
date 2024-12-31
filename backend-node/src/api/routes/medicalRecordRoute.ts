import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import config from "../../../config";
import IMedicalRecordController from '../../controllers/IControllers/IMedicalRecordController';
import { PatientMedicalRecordNumber } from '../../domain/MedicalRecord/patientMedicalRecordNumber';


const route = Router();

export default (app: Router) => {
  app.use('/medicalRecords', route);

  const ctrl = Container.get<IMedicalRecordController>(config.controllers.medicalRecord.name);

  route.get('', (req,res,next) => ctrl.getAllMedicalRecords(req, res, next));

  route.get('/:id',
    celebrate({
      params: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.getMedicalRecord(req, res, next));

    route.post('',
      (req, res, next) => ctrl.createMedicalRecord(req, res, next)
    );

    route.put(
      '',
      celebrate({
        body: Joi.object({
          id: Joi.string().required(), 
          patientMedicalRecordNumber: Joi.string().required(),
          allergiesId: Joi.array().items(Joi.string()).required(), 
          medicalConditionsId: Joi.array().items(Joi.string()).required(), 
          notations: Joi.string().required(),
        }),
      }),
      (req, res, next) => ctrl.updateMedicalRecord(req, res, next)
    );
  }