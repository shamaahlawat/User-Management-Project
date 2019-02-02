import { sendResponse } from '../utils/index';
import { decodeJWT } from '../utils/jwt';
import { User } from '../models';

const INVALID_TOKEN = 'Invalid/Missing token';

const isAuthenticated = async (req, res, next) => {
  // check req.header for token
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return sendResponse(res, 401, {}, INVALID_TOKEN);
    }
    const decoded = await decodeJWT({ token });
    if (!decoded.email || !decoded.id) {
      return sendResponse(res, 401, {}, INVALID_TOKEN);
    }
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return sendResponse(res, 404, {}, 'User not found');
    }
    req.user = decoded;
    return next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    if (err.name === 'TokenExpiredError') {
      return sendResponse(res, 401, {}, 'Token expired');
    } else if (err.name === 'JsonWebTokenError') {
      return sendResponse(res, 401, {}, INVALID_TOKEN);
    }
    return sendResponse(res, 500, {}, 'Something went wrong');
  }
};

export default isAuthenticated;
