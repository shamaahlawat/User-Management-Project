import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import { isEmail } from 'validator';
import { mongoose } from '../db';
import DefaultPermissions from './Permission.model';
import { PASS_HASH_ROUNDS, TOKEN_SECRET } from '../config';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: isEmail,
        message: '{value} is an invalid email'
      }
    },
    password: { type: String, required: true },
    firstName: { type: String, required: true, minlength: 1, trim: true },
    lastName: { type: String, required: true, minlength: 1, trim: true },
    designation: { type: String, default: null },
    bio: { type: String, default: null },
    socialLinks: {
      facebook: { type: String, default: null },
      twitter: { type: String, default: null },
      linkedin: { type: String, default: null }
    },
    refreshToken: String,
    verificationToken: String,
    passwordResetToken: { type: String, default: null },
    passwordResetTokenExpiry: { type: Number, default: null },
    accountVerificationToken: { type: String, default: null },
    accountVerificationTokenExpiry: { type: Number, default: null },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isPermissionSet: { type: Boolean, default: false },
    isPasswordSet: { type: Boolean, default: false },
    permissions: { type: Object, default: {} }
  },
  {
    minimize: false,
    timestamps: true,
    usePushEach: true // read abt this
  }
);

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(PASS_HASH_ROUNDS), null);
};

UserSchema.statics.findByCredentials = function(email, password) {
  let User = this;
  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject({
        code: 404,
        msg: 'Invalid email, user not found'
      });
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user._doc);
        } else {
          reject({ code: 401, msg: 'Incorrect Password' });
        }
      });
    });
  });
};

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, TOKEN_SECRET)
    .toString();

  return user.save().then(() => {
    return token;
  });
};

UserSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(PASS_HASH_ROUNDS, (err, salt) => {
      if (err) {
        throw err;
      }
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.pre('save', function(next) {
  const admin = this;
  if (!admin.isPermissionSet) {
    admin.permissions = DefaultPermissions;
    next();
  } else {
    next();
  }
});

UserSchema.methods.generateHash = function(password) {
  if (!process.env.PASS_HASH_ROUNDS) {
    throw new Error('Hash round not defined');
  }
  return bcrypt.hashSync(
    password,
    bcrypt.genSaltSync(process.env.PASS_HASH_ROUNDS),
    null
  );
};

export default mongoose.model('Users', UserSchema);
