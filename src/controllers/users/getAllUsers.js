import { isActionAllowed } from '../../utils/isAllowedToAccess';
import { sendResponse, handleCustomThrow } from '../../utils';
import { getAllUsersService } from '../../services/users/user.services';
import PERMISSIONS from '../../constants/checkPermission';

export async function getUsers(req, res) {
  try {
    const checkAction = await isActionAllowed(
      req.user.id,
      PERMISSIONS.userManagement
    );
    if (!checkAction || !checkAction.read) {
      return sendResponse(res, 403, {}, 'Not allowed');
    }

    const data = await getAllUsersService();
    return sendResponse(res, 200, { users: data }, 'Fetched data successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error in get all users: ', error);
    return handleCustomThrow(res, error);
  }
}
