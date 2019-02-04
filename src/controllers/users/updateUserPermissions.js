import { updateUserPermissionsService } from '../../services/users/user.services';
import { sendResponse, handleCustomThrow } from '../../utils';
import {
  isActionAllowed,
  isOperationAllowed
} from '../../utils/isAllowedToAccess';
import { validateUpdatePermissionsPayload } from './_requestValidators';
import PERMISSIONS from '../../constants/checkPermission';

export async function updateUserPermissions(req, res) {
  try {
    const errors = validateUpdatePermissionsPayload(req);
    if (errors) {
      return sendResponse(res, 400, {}, errors[0].msg);
    }

    const checkAction = await isActionAllowed(
      req.user.id,
      PERMISSIONS.userManagement
    );
    if (!checkAction || !checkAction.update) {
      return sendResponse(res, 403, {}, 'Not allowed');
    }

    const { email, permissions } = req.body;

    if (!permissions) {
      return sendResponse(res, 422, {}, 'Missing permissions object');
    }

    await isOperationAllowed({ id: req.user.id, operationEmail: email });
    const data = await updateUserPermissionsService({ email, permissions });
    return sendResponse(res, 200, { user: data }, 'Fetched data successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error in update user settings: ', error);
    return handleCustomThrow(res, error);
  }
}
