import { handleCustomThrow, sendResponse } from '../../utils';
import { getUserPermissionsService } from '../../services/users/user.services';
import { isActionAllowed } from '../../utils/isAllowedToAccess';
import { validateGetPermissionsPayload } from './_requestValidators';
import PERMISSIONS from '../../constants/checkPermission';

export async function getUserPermissions(req, res) {
  try {
    const errors = validateGetPermissionsPayload(req);
    if (errors) {
      return sendResponse(res, 400, {}, errors[0].msg);
    }

    if (!req.user) {
      return sendResponse(res, 401, {}, 'Invalid request');
    }

    const checkAction = await isActionAllowed(
      req.user.id,
      PERMISSIONS.userManagement
    );
    if (!checkAction || !checkAction.read) {
      return sendResponse(res, 403, {}, 'Not allowed');
    }

    const { id } = req.query;
    const data = await getUserPermissionsService({ id });
    return sendResponse(res, 200, { user: data }, 'Fetched data successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error in get user permissions', error);
    return handleCustomThrow(res, error);
  }
}
