import { validateUserCreationPayload } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils';
import { isActionAllowed } from '../../utils/isAllowedToAccess';
import {
  createUserService,
  getUsersUsingEmailsService
} from '../../services/users/user.services';
import PERMISSIONS from '../../constants/checkPermission';

export async function createUsers(req, res) {
  try {
    const errors = validateUserCreationPayload(req);
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

    const { users = [] } = req.body;
    const { host } = req;
    if (!host) {
      throw { code: 400, msg: 'host value is invalid/missing ' };
    }
    const emails = users.map(e => e.email);
    await createUserService({ users, host });
    const newUsers = await getUsersUsingEmailsService({ emails });
    return sendResponse(
      res,
      200,
      { users: newUsers },
      'Created users successfully'
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    if (error.name === 'MongoError' && error.code === 11000) {
      console.log('helllllllllllllllo');
      return sendResponse(
        res,
        409,
        {},
        'Duplicate Email, email already exists'
      );
    } else if (error.name === 'ValidationError') {
      return sendResponse(res, 400, {}, 'Invalid email/name');
    }
    return handleCustomThrow(res, error);
  }
}
