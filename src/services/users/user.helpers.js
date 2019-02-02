import { issueJWT } from '../../utils/jwt';
import { User } from '../../models';

const INVALID_USER = 'User is either de-activated or deleted';

export function addDefaultPasswordField(collection) {
  if (!collection.length) return;
  for (let i = 0; i < collection.length; i++) {
    if (!collection[i].password) {
      collection[i].password = `${collection[i].lastName}$${+new Date()}$${
        collection[i].firstName
      }`;
    }
  }
}

export async function generateJWT({ user }) {
  const jwtPayload = {
    id: user._id,
    email: user.email
  };
  const token = await issueJWT({ payload: jwtPayload });
  return token;
}

export function sanitizeUserObject(user) {
  if (!user) return user;
  if (user.hasOwnProperty('password')) delete user.password;
  if (user.hasOwnProperty('isPermissionSet')) delete user.isPermissionSet;
  if (user.hasOwnProperty('passwordResetToken')) delete user.passwordResetToken;
  if (user.hasOwnProperty('isVerified')) delete user.isVerified;
  if (user.hasOwnProperty('isActive')) delete user.isActive;
  if (user.hasOwnProperty('isDeleted')) delete user.isDeleted;
  if (user.hasOwnProperty('isPasswordSet')) delete user.isPasswordSet;
  if (user.hasOwnProperty('createdAt')) delete user.createdAt;
  if (user.hasOwnProperty('updatedAt')) delete user.updatedAt;
  if (user.hasOwnProperty('__v')) delete user.__v;
  return JSON.parse(JSON.stringify(user));
}

export async function doesUserExists(query) {
  // console.log('query inside doesUserExists --------------->', query);
  const user = await User.findOne(query);
  // console.log('query data inside doesUserExists --------------->', user);
  if (!user || user.isDeleted) {
    throw { code: 404, msg: INVALID_USER };
  }
  return user;
}
