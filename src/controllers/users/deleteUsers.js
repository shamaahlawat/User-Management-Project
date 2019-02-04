import { validateUserEmailAndId } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils';
import {
  isActionAllowed,
  isOperationAllowed
} from '../../utils/isAllowedToAccess';
import { deleteUserService } from '../../services/users/user.services';
import PERMISSIONS from '../../constants/checkPermission';

export async function deleteExistinUser(req, res) {
  try {
    const errors = validateUserEmailAndId(req); // both payload are same
    if (errors) {
      return sendResponse(res, 400, {}, errors[0].msg);
    }

    const checkAction = await isActionAllowed(
      req.user.id,
      PERMISSIONS.userManagement
    );
    if (!checkAction || !checkAction.create) {
      return sendResponse(res, 403, {}, 'Not allowed');
    }

    const { email, id } = req.body;
    await isOperationAllowed({ id: req.user.id, operationEmail: email });

    const data = await deleteUserService({ email, id });
    return sendResponse(res, 200, { user: data }, 'Action successfully');
  } catch (error) {
    console.error('error in delete user: ', error);
    return handleCustomThrow(res, error);
  }
}
