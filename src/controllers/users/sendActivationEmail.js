import { handleCustomThrow, sendResponse } from '../../utils';
import { sendActivationEmailService } from '../../services/users/user.services';
import { validateUserEmail } from './_requestValidators';

export async function sendActivationEmail(req, res) {
  try {
    const errors = validateUserEmail(req);
    if (errors) {
      return sendResponse(res, 400, {}, errors[0].msg);
    }
    const { email, host } = req.body;
    if (!host) {
      throw { code: 400, msg: 'host value is invalid/missing ' };
    }
    const data = await sendActivationEmailService({ email, host });
    return sendResponse(res, 200, { user: data }, 'Email sent successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error in sending activation email: ', error);
    return handleCustomThrow(res, error);
  }
}
