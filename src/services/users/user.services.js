import mongoose from 'mongoose';

import {
  addDefaultPasswordField,
  generateJWT,
  doesUserExists
} from './user.helpers';
import { User } from '../../models';
import { isActionAllowed } from '../../utils/isAllowedToAccess';
import { generateTemporaryTokens } from '../../utils/jwt';
import { sendEmailUsingSendgrid } from '../../utils/sendEmail';
import { generateHash } from '../../utils/hash';

const INVALID_USER = 'Verification failed, Invalid User';
const THROW_403 = {
  code: 403,
  msg: 'Verification failed, you are not authorized to perform this action'
};

export async function createUserService({ users, host }) {
  if (!host) {
    throw new Error('Invalid HOST');
  }

  addDefaultPasswordField(users);
  for (let i = 0; i < users.length; i++) {
    const accountActivationToken = await generateTemporaryTokens({
      activeDays: 2
    });
    users[i].accountVerificationToken = accountActivationToken.token;
    users[i].accountActivationTokenExpiry = accountActivationToken.expiry;
    const newUser = await new User(users[i]);
    await newUser.save();
    // generate email content
    const verifyAccountLink = `${host}/auth/activate?email=${
      users[i].email
    }&token=${accountActivationToken.token}&tokenType=activation`;
    const fullName = users[i].firstName + ' ' + users[i].lastName;
    const mail = {
      to: `${fullName} <${users[i].email}>`,
      from: 'NS Team <no-reply@nsteam.com>',
      subject: 'Account Activation.',
      html: `Please verify your email address to activate your account using this link :- ${verifyAccountLink}<br><br><strong>For any help, please reach out to your system admin.</strong>`
    };
    await sendEmailUsingSendgrid(mail);
  }
}

export async function getAllUsersService() {
  const result = await User.find(
    {},
    'socialLinks designation bio email firstName lastName isActive isVerified isDeleted'
  );
  return result;
}

export async function loginUserService({ email, password }) {
  await doesUserExists({ email });
  const user = await User.findByCredentials(email, password);
  if (!user.isActive) {
    throw { code: 403, msg: 'Acccount is disabled' };
  }

  if (!user.isVerified) {
    throw { code: 403, msg: 'Acccount is not activated' };
  }

  const token = await generateJWT({ user });
  const fileds =
    'socialLinks designation bio email firstName lastName isActive isVerified isDeleted permissions';
  const userDetails = await getUsersUsingEmailsService({
    emails: [email],
    fileds
  });
  if (!userDetails.length) {
    throw { code: 404, msg: 'User not found/Incorrect credentials' };
  }
  return { token, user: userDetails[0], _id: user._id };
}

export async function checkUserPermissionService({ _id, action }) {
  if (action) {
    await doesUserExists({ _id });
    const actionPermissions = await isActionAllowed(_id, action);
    return actionPermissions;
  }
}

export async function getUserPermissionsService({ id }) {
  await doesUserExists({ _id: new mongoose.Types.ObjectId(id) });
  const fileds =
    'socialLinks designation bio email firstName lastName isActive isVerified isDeleted permissions';
  const userDetails = await User.find({ _id: id }, fileds);
  if (!userDetails.length) {
    throw { code: 404, msg: 'User not found' };
  }
  return userDetails;
}

export async function updateUserPermissionsService({ email, permissions }) {
  await doesUserExists({ email });
  const user = await User.findOne({ email });
  if (!user) {
    throw { code: 404, msg: 'User not found' };
  }
  await User.updateOne({ email }, { $set: { permissions } });
  const fileds =
    'socialLinks designation bio email firstName lastName isActive isVerified isDeleted permissions';
  const userDetails = await getUsersUsingEmailsService({
    emails: [email],
    fileds
  });
  return userDetails;
}

export async function updateUserProfileService({ email, updates }) {
  await doesUserExists({ email });
  // do not allow to upate email and user permissions
  const user = await User.findOne({ email }).select({ permissions: 1 });
  if (!user) {
    throw { code: 404, msg: 'User not found' };
  }
  const permissions = user._doc.permissions;
  updates.permissions = permissions;
  if (updates.email) delete updates.email;
  await User.updateOne({ email }, { $set: { ...updates } });
  const userDetails = await getUsersUsingEmailsService({ emails: [email] });
  return userDetails;
}

export async function forgotPasswordService({ email, host }) {
  if (!host) {
    throw { code: 400, msg: 'Invalid HOST' };
  }
  await doesUserExists({ email });

  const passwordResetToken = await generateTemporaryTokens({ activeDays: 2 });
  const isValidUser = await User.findOne({ email });
  if (!isValidUser) {
    throw { code: 404, msg: 'User not found' };
  }
  await User.updateOne(
    { email },
    {
      $set: {
        passwordResetToken: passwordResetToken.token,
        passwordResetTokenExpiry: passwordResetToken.expiry
      }
    }
  );

  // generate email content
  const passwordResetLink = `${host}/auth/resetpassword?email=${email}&token=${
    passwordResetToken.token
  }&tokenType=password`;
  const fullName = isValidUser.firstName + ' ' + isValidUser.lastName;
  const mail = {
    to: `${email}`,
    from: 'NS Team <no-reply@nsteam.com>',
    subject: 'Password Reset.',
    html: `Hello ${fullName}, to change your account password using this link :- ${passwordResetLink}<br><br><strong>For any help, please reach out to your system admin.</strong>`
  };

  await sendEmailUsingSendgrid(mail);
  const userDetails = await getUsersUsingEmailsService({ emails: [email] });
  return userDetails;
}

export async function resetPasswordService({ email, token, password }) {
  await doesUserExists({ email });

  const user = await User.findOne({ passwordResetToken: token });
  if (!user) {
    throw { code: 404, msg: INVALID_USER };
  }

  const tokenFromDB = user.passwordResetToken;
  if (tokenFromDB !== token) {
    throw THROW_403;
  }

  if (user.passwordResetTokenExpiry < +new Date()) {
    throw THROW_403;
  }

  const hashedPassword = await generateHash(password);

  await User.updateOne(
    { email },
    {
      $set: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiry: null
      }
    }
  );

  // generate email content
  const fullName = user.firstName + ' ' + user.lastName;
  const mail = {
    to: `${email}`,
    from: 'NS Team <no-reply@nsteam.com>',
    subject: 'Password Changed.',
    html: `Hello ${fullName}, you have updated your password. <br><br><strong>For any help, please reach out to your system admin.</strong>`
  };

  await sendEmailUsingSendgrid(mail);
  const userDetails = await getUsersUsingEmailsService({ emails: [email] });
  return userDetails;
}

export async function activateAccountService({ email, token, password }) {
  const user = await doesUserExists({ accountVerificationToken: token });

  await doesUserExists({ email });

  const tokenFromDB = user.accountVerificationToken;
  if (tokenFromDB !== token) {
    throw THROW_403;
  }

  if (user.accountActivationTokenExpiry < +new Date()) {
    throw THROW_403;
  }

  const hashedPassword = await generateHash(password);

  await User.updateOne(
    { email },
    {
      $set: {
        password: hashedPassword,
        accountVerificationToken: null,
        accountActivationTokenExpiry: null,
        isVerified: true,
        isActive: true
      }
    }
  );

  // generate email content
  const fullName = user.firstName + ' ' + user.lastName;
  const mail = {
    to: `${email}`,
    from: 'NS Team <no-reply@nsteam.com>',
    subject: 'Account Activated',
    html: `Hello ${fullName}, you have verified your account successfully. <br><br><strong>For any help, please reach out to your system admin.</strong>`
  };

  await sendEmailUsingSendgrid(mail);
  const userDetails = await getUsersUsingEmailsService({ emails: [email] });
  return userDetails;
}

export async function verifyTemporaryTokenService({ token, tokenType, email }) {
  if (!token || !tokenType) {
    throw { code: 400, msg: 'Invalid/Missing token or token type' };
  }

  let tokenField = null;
  if (tokenType === 'password') {
    tokenField = 'passwordResetToken';
  } else if (tokenType === 'activation') {
    tokenField = 'accountVerificationToken';
  }

  const query = {};
  query[tokenField] = token;

  const user = await User.findOne(query);

  if (!user) {
    throw THROW_403;
  }
  const userDetails = await getUsersUsingEmailsService({ emails: [email] });
  return userDetails;
}

export async function getUsersUsingEmailsService({ emails, fileds }) {
  if (!fileds) {
    fileds =
      'socialLinks designation bio email firstName lastName isActive isVerified isDeleted';
  }
  const users = await User.find({ email: { $in: emails } }, fileds);
  return users;
}

export async function deleteUserService({ id, email }) {
  await doesUserExists({ email });
  await User.updateOne(
    { email, _id: id },
    {
      $set: {
        isVerified: false,
        isActive: false,
        isDeleted: true
      }
    }
  );

  const userDetails = await getUsersUsingEmailsService({ emails: [email] });
  return userDetails;
}

export async function toggleUserIsActiveService({ id, email, isActive }) {
  await doesUserExists({ email });

  const checkUser = await User.findOne({ _id: id, email });
  if (!checkUser || checkUser.isDeleted) {
    throw { code: 404, msg: 'User not found/deleted' };
  }

  if (!checkUser.isVerified) {
    throw { code: 400, msg: 'User is not yet verified' };
  }
  await User.updateOne(
    { email, _id: id },
    {
      $set: {
        isActive
      }
    }
  );

  const userDetails = await getUsersUsingEmailsService({ emails: [email] });
  return userDetails;
}

export async function sendActivationEmailService({ email, host }) {
  if (!host) {
    throw { code: 400, msg: 'Invalid HOST' };
  }
  await doesUserExists({ email });

  const checkUser = await User.findOne({ email });
  if (!checkUser) {
    throw { code: 404, msg: 'User not found' };
  }

  if (checkUser.isActive) {
    throw { code: 400, msg: 'User is already active' };
  }

  const accountVerificationToken = await generateTemporaryTokens({
    activeDays: 2
  });

  const verifyAccountLink = `${host}/auth/activate?email=${email}&token=${
    accountVerificationToken.token
  }&tokenType=activation`;
  const fullName = checkUser.firstName + ' ' + checkUser.lastName;
  const mail = {
    to: `${fullName} <${email}>`,
    from: 'NS Team <no-reply@nsteam.com>',
    subject: 'Account Activation.',
    html: `Please verify your email address to activate your account using this link :- ${verifyAccountLink}<br><br><strong>For any help, please reach out to your system admin.</strong>`
  };
  await sendEmailUsingSendgrid(mail);

  await User.findOneAndUpdate(
    { email },
    {
      $set: {
        accountVerificationToken: accountVerificationToken.token,
        accountVerificationTokenExpiry: accountVerificationToken.expiry,
        isActive: false,
        isVerified: false,
        isDeleted: true
      }
    }
  );

  const userDetails = await getUsersUsingEmailsService({ emails: [email] });
  return userDetails;
}
