import { validateResetPasswordPayload } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils';
import { resetPasswordService } from '../../services/users/user.services';

export async function resetPassword(req, res) {
  try {
    const errors = validateResetPasswordPayload(req);
    if (errors) {
      return sendResponse(res, 400, {}, errors[0].msg);
    }

    const { email, password, token } = req.body;
    const data = await resetPasswordService({ email, password, token });
    return sendResponse(res, 200, { data }, 'Updated password successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error in reset password: ', error);
    return handleCustomThrow(res, error);
  }
}
