// users routes here
import { Router } from 'express';
import {
  loginUser,
  createUsers,
  getUsers,
  getUserPermissions,
  updateUserPermissions,
  updateUserProfile,
  checkUserPermission,
  forgotPassword,
  resetPassword,
  activateAccount,
  verifyTemporaryToken,
  toggleIsActiveUser,
  sendActivationEmail,
  deleteExistinUser
} from '../controllers/users';
import { isAuthenticated } from '../middlewares';

const userRoutes = Router();

userRoutes.post('/login', loginUser);
userRoutes.post('/token/verify', verifyTemporaryToken);
userRoutes.post('/password/forgot', forgotPassword);
userRoutes.post('/password/reset', resetPassword);
userRoutes.post('/account/verify', activateAccount);
userRoutes.post('/email/activation', sendActivationEmail);
userRoutes.get('/admins/allow', checkUserPermission);
userRoutes.post('/admins', isAuthenticated, createUsers);
userRoutes.get('/admins', isAuthenticated, getUsers);
userRoutes.get('/admins/settings', isAuthenticated, getUserPermissions);
userRoutes.patch('/admins/settings', isAuthenticated, updateUserPermissions);
userRoutes.patch('/admins/activation', isAuthenticated, toggleIsActiveUser);
userRoutes.delete('/admins', isAuthenticated, deleteExistinUser);
userRoutes.patch('/admins/profile', isAuthenticated, updateUserProfile);

export default userRoutes;
