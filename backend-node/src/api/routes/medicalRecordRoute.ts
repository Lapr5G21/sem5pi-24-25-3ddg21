import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import config from "../../../config";
import IMedicalRecordController from '../../controllers/IControllers/IMedicalRecordController';


const route = Router();

export default (app: Router) => {
  app.use('/medicalRecords', route);

  const ctrl = Container.get<IMedicalRecordController>(config.controllers.medicalRecord.name);

  route.get('/', ctrl.getAllMedicalRecords);

  route.get('/:id',
    celebrate({
      params: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.getMedicalRecord(req, res, next));

  route.post('',
    celebrate({
      body: Joi.object({
        
      }),
    }),
    (req, res, next) => ctrl.createMedicalRecord(req, res, next));

  route.put('/medicalRecords/:id',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        code: Joi.string().required(),
        description: Joi.string().required()
      }),
      params: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.updateMedicalRecord(req, res, next));
};