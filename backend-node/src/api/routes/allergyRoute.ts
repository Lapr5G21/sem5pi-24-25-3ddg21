import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';

import config from "../../../config";
import IAllergyController from '../../controllers/IControllers/IAllergyController';


const route = Router();

export default (app: Router) => {
  app.use('/allergies', route);

  const ctrl = Container.get<IAllergyController>(config.controllers.allergy.name);

  route.get('/', (req, res, next) => ctrl.getAllAllergies(req, res, next));

  route.get('/:id',
    celebrate({
      params: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.getAllergy(req, res, next));

  route.post('',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        code: Joi.string().required(),
        description: Joi.string().required()
      }),
    }),
    (req, res, next) => ctrl.createAllergy(req, res, next));

  route.put('/allergies/:id',
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
    (req, res, next) => ctrl.updateAllergy(req, res, next));

    route.delete('/api/allergies/:code/delete', (req, res, next) => ctrl.deleteAllergy(req, res, next));
};