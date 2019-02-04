import { handleCustomThrow, sendResponse } from '../../utils';
import { updateUserProfileService } from '../../services/users/user.services';
import { validateUpdateProfilePayload } from './_requestValidators';

export async function updateUserProfile(req, res) {
  try {
    const errors = validateUpdateProfilePayload(req);
    if (errors) {
      return sendResponse(res, 400, {}, errors[0].msg);
    }

    if (!req.user) {
      return sendResponse(res, 401, {}, 'Invalid request');
    }
    const { email } = req.user;
    const { updates } = req.body;
    const data = await updateUserProfileService({
      email,
      updates
    });
    return sendResponse(
      res,
      200,
      { user: data },
      'Update details successfully'
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error in update user profile: ', error);
    return handleCustomThrow(res, error);
  }
}
