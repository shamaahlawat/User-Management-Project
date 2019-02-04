import { validateUserLoginPayload } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils';
import { loginUserService } from '../../services/users/user.services';

export async function loginUser(req, res) {
  try {
    const errors = validateUserLoginPayload(req);
    if (errors) {
      return sendResponse(res, 400, {}, errors[0].msg);
    }

    const { email, password } = req.body;

    const data = await loginUserService({ email, password });
    return sendResponse(res, 200, { ...data }, 'Login successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error in login: ', error);
    return handleCustomThrow(res, error);
  }
}
