import {
  validateArayOfNameAndEmail,
  isValidObjectId
} from '../../utils/customValidators';

export function validateUserCreationPayload(req) {
  req
    .checkBody('users', 'User details are required/invalid')
    .custom(validateArayOfNameAndEmail)
    .exists();
  return req.validationErrors();
}

export function validateUserLoginPayload(req) {
  req
    .checkBody('email', 'Email is required/invalid')
    .isEmail()
    .exists();
  req
    .checkBody('password', 'Password is required/invalid/less than 5 chars')
    .isLength({ min: 5 })
    .exists();

  return req.validationErrors();
}

export function validateUpdatePermissionsPayload(req) {
  req
    .checkBody('email', 'Email is required/invalid')
    .isEmail()
    .exists();
  req
    .checkBody('permissions', 'Permissions object is required/invalid')
    .exists();

  return req.validationErrors();
}

export function validateGetPermissionsPayload(req) {
  req
    .checkQuery('id', 'id is required/invalid')
    .custom(isValidObjectId)
    .isLength({ min: 10 })
    .exists();

  return req.validationErrors();
}

export function validateUpdateProfilePayload(req) {
  req
    .checkBody('updates.firstName', 'First name is required/min 3 chars')
    .isLength({ min: 3 })
    .optional();
  req
    .checkBody('updates.lastName', 'Last name is required/min 3 chars')
    .isLength({ min: 2 })
    .optional();
  req
    .checkBody('updates.socialLinks.facebook', 'Facebook url is invalid')
    .isURL()
    .optional();
  req
    .checkBody('updates.socialLinks.twitter', 'Twitter url is invalid')
    .isURL()
    .optional();
  req
    .checkBody('updates.socialLinks.linkedin', 'Linkedin url is invalid')
    .isURL()
    .optional();
  req
    .checkBody('updates.designation', 'Designation should be minimum 3 chars')
    .isLength({ min: 3 })
    .optional();
  req
    .checkBody('updates.bio', 'Bio should be minimum 10 chars')
    .isLength({ min: 5 })
    .optional();

  return req.validationErrors();
}

export function validateUserEmail(req) {
  req
    .checkBody('email', 'Email is required/invalid')
    .isEmail()
    .exists();
  return req.validationErrors();
}

export function validateResetPasswordPayload(req) {
  req
    .checkBody('email', 'Email is required/invalid')
    .isEmail()
    .exists();
  req
    .checkBody('password', 'Password is required/invalid')
    .isLength({ min: 5 })
    .exists();
  req.checkBody('token', 'Token is required/invalid').exists();
  return req.validationErrors();
}

export function validateUserEmailAndId(req) {
  req
    .checkBody('email', 'Email is required/invalid')
    .isEmail()
    .exists();
  req
    .checkBody('id', 'id is required/invalid')
    .custom(isValidObjectId)
    .exists();
  return req.validationErrors();
}

export function validateUserActivationPayload(req) {
  req
    .checkBody('email', 'Email is required/invalid')
    .isEmail()
    .exists();
  req
    .checkBody('id', 'id is required/invalid')
    .custom(isValidObjectId)
    .exists();
  req
    .checkBody('isActive', 'isActive is required/invalid')
    .isBoolean()
    .exists();
  return req.validationErrors();
}
