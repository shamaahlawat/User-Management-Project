import { handleCustomThrow, sendResponse } from '../../utils';
import { checkUserPermissionService } from '../../services/users/user.services';
import { decodeJWT } from '../../utils/jwt';

export async function checkUserPermission(req, res) {
  try {
    const token = req.header('x-intra-access-token');
    if (!token) {
      return sendResponse(res, 401, {}, 'Invalid/missing token');
    }
    const decode = await decodeJWT({ token });
    if (!decode) {
      return sendResponse(res, 401, {}, 'Invalid/missing token');
    }
    const { userId, action, eventName, psId } = req.query;
    const data = await checkUserPermissionService({
      _id: userId,
      action,
      eventName,
      psId
    });
    return sendResponse(
      res,
      200,
      { permissions: data },
      'Fetched data successfully'
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error in check user permission: ', error);
    return handleCustomThrow(res, error);
  }
}
