import { validateUserActivationPayload } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils';
import {
  isActionAllowed,
  isOperationAllowed
} from '../../utils/isAllowedToAccess';
import { toggleUserIsActiveService } from '../../services/users/user.services';
import PERMISSIONS from '../../constants/checkPermission';

export async function toggleIsActiveUser(req, res) {
  try {
    const errors = validateUserActivationPayload(req); // both payload are same
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

    const { email, id, isActive } = req.body;
    await isOperationAllowed({ id: req.user.id, operationEmail: email });

    const data = await toggleUserIsActiveService({ email, id, isActive });
    return sendResponse(res, 200, { user: data }, 'Action successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error in toggle isActive: ', error);
    return handleCustomThrow(res, error);
  }
}
