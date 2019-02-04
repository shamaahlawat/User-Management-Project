import { handleCustomThrow, sendResponse } from '../../utils';
import { activateAccountService } from '../../services/users/user.services';
import { validateResetPasswordPayload } from './_requestValidators';

export async function activateAccount(req, res) {
  try {
    const errors = validateResetPasswordPayload(req); // both payload are same
    if (errors) {
      return sendResponse(res, 400, {}, errors[0].msg);
    }

    const { email, password, token } = req.body;
    const data = await activateAccountService({ email, password, token });
    return sendResponse(
      res,
      200,
      { data },
      'Account verification successfully'
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error in account verification: ', error);
    return handleCustomThrow(res, error);
  }
}
