const config = {
  MONGODB_USERNAME: '',
  MONGODB_PASSWORD: '',
  MONGODB_HOST: 'localhost',
  MONGODB_PORT: 27017,
  MONGODB_DATABASE_NAME: 'NS_Work',
  TOKEN_SECRET: 'dummytokensecrethere',
  ACCESS_TOKEN_EXPIRY: '1d',
  ACCESS_TOKEN_ALGO: 'HS256',
  REFRESH_TOKEN_EXPIRY: '7d',
  REFRESH_TOKEN_ALGO: 'HS384',
  PASS_HASH_ROUNDS: 10,
  SENDGRID_API_KEY: ''
};

export default config;
