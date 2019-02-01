import sendResponse from './sendResponse';
import customValidators from './customValidators';
import jwtUtils from './jwt';

export { sendResponse, customValidators, jwtUtils };

export function handleCustomThrow(res, error) {
  // eslint-disable-next-line no-console
  console.error(error);
  try {
    if (error.code === 400) {
      return sendResponse(res, error.code, {}, error.msg);
    }
    if (error.code === 401) {
      return sendResponse(res, error.code, {}, error.msg);
    }
    if (error.code === 403) {
      return sendResponse(res, error.code, {}, error.msg);
    }
    if (error.code === 404) {
      return sendResponse(res, error.code, {}, error.msg);
    }
  } catch (err) {
    // throw new Error(err);
    return sendResponse(res, 500, {}, 'Something went wrong');
  }
}
