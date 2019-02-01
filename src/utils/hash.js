import bcrypt from 'bcrypt-nodejs';
import CONFIG from '../config';

export async function generateHash(payload) {
  const hash = await bcrypt.hashSync(
    payload,
    bcrypt.genSaltSync(CONFIG.PASS_HASH_ROUNDS),
    null
  );
  return hash;
}
