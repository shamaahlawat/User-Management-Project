import mongoose from '../../db/mongoose';
import { isEmail } from 'validator';

export function validateArayOfNameAndEmail(collection) {
  if (!collection) return false;
  let isValid = true;
  for (let i = 0; i < collection.length; i++) {
    if (
      !collection[i].email ||
      !isEmail(collection[i].email) ||
      !collection[i].firstName ||
      !collection[i].lastName
    ) {
      isValid = false;
      break;
    }
  }
  return isValid;
}

export const isValidObjectId = value => mongoose.Types.ObjectId.isValid(value);
