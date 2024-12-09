import { Router } from 'express';
import auth from './routes/userRoute';
import user from './routes/userRoute';
import role from './routes/roleRoute';
import allergyRoute from './routes/allergyRoute';
import medicalConditionRoute from './routes/medicalConditionRoute';
import medicalRecordRoute from './routes/medicalRecordRoute';

export default () => {
	const app = Router();

	auth(app);
	user(app);
	role(app);
	allergyRoute(app);
	medicalConditionRoute(app);
	medicalRecordRoute(app);
	
	return app
}