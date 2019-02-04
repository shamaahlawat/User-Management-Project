import { handleCustomThrow, sendResponse } from '../../utils';
import { verifyTemporaryTokenService } from '../../services/users/user.services';

export async function verifyTemporaryToken(req, res) {
  try {
    const { tokenType, token, email } = req.body;
    const data = await verifyTemporaryTokenService({ email, token, tokenType });
    return sendResponse(
      res,
      200,
      { user: data },
      'Token verification successfully'
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in verify token: ', error);
    return handleCustomThrow(res, error);
  }
}
