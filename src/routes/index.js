import { Router } from 'express';
import userRoutes from './user.routes';
import { sendResponse } from '../utils';

const routes = Router();

routes.get('/', (req, res) => {
  sendResponse(res, 200, { message: 'Welcome to User Module' }, 'Good to go!');
});
routes.use('/', userRoutes);

export default routes;
