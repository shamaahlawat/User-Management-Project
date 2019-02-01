import { User } from '../models';
import { defaultActionObject } from '../models/Permission.model';

const USER_NOT_FOUND = 'Permission check failed, user not found';
const USER_INVALID = 'Permission check failed, user is invalid';
const INVALID_OPERATION = 'Invalid operation, not allowed';

export async function isActionAllowed(_id, action) {
  const user = await User.findById(_id);
  if (!user) {
    throw { code: 404, msg: USER_NOT_FOUND };
  }
  if (!user.permissions) {
    throw { code: 401, msg: USER_INVALID };
  }
  const actionCRUD = user.permissions.actions[action];
  return actionCRUD || defaultActionObject;
}

export async function isOperationAllowed({ id, operationEmail }) {
  const user = await User.findOne({ email: operationEmail });
  if (!user) {
    return;
  }
  if (String(user._id) === id) {
    throw { code: 403, msg: INVALID_OPERATION };
  }
}
