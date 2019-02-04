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
  deleteExistingUser
} from '../controllers/users';
import { isAuthenticated } from '../middlewares';

const userRoutes = Router();

userRoutes.post('/login', loginUser);
userRoutes.post('/token/verify', verifyTemporaryToken);
userRoutes.post('/password/forgot', forgotPassword);
userRoutes.post('/password/reset', resetPassword);
userRoutes.post('/account/verify', activateAccount);
userRoutes.post('/email/activation', sendActivationEmail);
userRoutes.get('/users/allow', checkUserPermission);
userRoutes.post('/users', isAuthenticated, createUsers);
userRoutes.get('/users', isAuthenticated, getUsers);
userRoutes.get('/users/settings', isAuthenticated, getUserPermissions);
userRoutes.patch('/users/settings', isAuthenticated, updateUserPermissions);
userRoutes.patch('/users/activation', isAuthenticated, toggleIsActiveUser);
userRoutes.delete('/users', isAuthenticated, deleteExistingUser);
userRoutes.patch('/users/profile', isAuthenticated, updateUserProfile);

export default userRoutes;
