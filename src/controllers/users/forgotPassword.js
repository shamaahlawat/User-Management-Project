import { validateUserEmail } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils';
import { forgotPasswordService } from '../../services/users/user.services';

export async function forgotPassword(req, res) {
  try {
    const errors = validateUserEmail(req);
    if (errors) {
      return sendResponse(res, 400, {}, errors[0].msg);
    }
    const { email, host } = req.body;
    if (!host) {
      throw { code: 400, msg: 'host value is invalid/missing ' };
    }
    const data = await forgotPasswordService({ email, host });
    return sendResponse(res, 200, { data }, 'Sent email successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error in forgot password: ', error);
    return handleCustomThrow(res, error);
  }
}
