import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';
import path from 'path';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const userSchema = {
    // compare with the approach followed in repos and services
    name: 'userSchema',
    schema: '../persistence/schemas/userSchema',
  };

  const roleSchema = {
    // compare with the approach followed in repos and services
    name: 'roleSchema',
    schema: '../persistence/schemas/roleSchema',
  };

  const allergySchema = {
    name: 'allergySchema',
    schema: '../persistence/schemas/allergySchema',
  };

  const medicalConditionSchema = {
    name: 'medicalConditionSchema',
    schema: '../persistence/schemas/medicalConditionSchema',
  };

  const medicalRecordSchema ={
    name: 'medicalRecordSchema',
    schema: '../persistence/schemas/medicalRecordSchema',
  }

  const roleController = {
    name: config.controllers.role.name,
    path: config.controllers.role.path
  }

  const roleRepo = {
    name: config.repos.role.name,
    path: config.repos.role.path
  }

  const userRepo = {
    name: config.repos.user.name,
    path: config.repos.user.path
  }

  const allergyRepo = {
    name: config.repos.allergy.name,
    path: config.repos.allergy.path
  }

  const medicalConditionRepo = {
    name: config.repos.medicalCondition.name,
    path: config.repos.medicalCondition.path
  }

  const medicalRecordRepo = {
    name: config.repos.medicalRecord.name,
    path: config.repos.medicalRecord.path
  }

  const medicalRecordController = {
    name: config.controllers.medicalRecord.name,
    path: config.controllers.medicalRecord.path
  }


  const roleService = {
    name: config.services.role.name,
    path: config.services.role.path
  }

 const allergyController = {
    name: config.controllers.allergy.name,
    path: config.controllers.allergy.path
 }

 const medicalConditionController = {
  name: config.controllers.medicalCondition.name,
  path: config.controllers.medicalCondition.path
}


  const allergyService = {
    name: config.services.allergy.name,
    path: config.services.allergy.path
  }

  const medicalConditionService = {
    name: config.services.medicalCondition.name,
    path: config.services.medicalCondition.path
  }

  const medicalRecordService = {
    name: config.services.medicalRecord.name,
    path: config.services.medicalRecord.path
  }

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      userSchema,
      roleSchema,
      allergySchema,
      medicalConditionSchema,
      medicalRecordSchema

    ],
    controllers: [
      roleController,
      allergyController,
      medicalConditionController,
      medicalRecordController
    ],
    repos: [
      roleRepo,
      userRepo,
      allergyRepo,
      medicalConditionRepo,
      medicalRecordRepo
    ],
    services: [
      roleService,
      allergyService,
      medicalConditionService,
      medicalRecordService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
