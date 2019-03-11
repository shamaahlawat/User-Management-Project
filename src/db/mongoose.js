import mongoose from 'mongoose';
import CONFIG from '../config';

const {
  MONGODB_USERNAME: username,
  MONGODB_PASSWORD: password,
  MONGODB_HOST: host,
  MONGODB_PORT: port,
  MONGODB_DATABASE_NAME: databaseName
} = CONFIG;

mongoose.Promise = global.Promise;

//const MONGO_URL = `mongodb://${host}:${port}/${databaseName}`;
const MONGODB_URI = 'mongodb://manmeet:manmeet12@ds121495.mlab.com:21495/weaverse';

const options = {
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  useNewUrlParser: true
};

mongoose.connect(MONGODB_URI, options);
mongoose.set('useCreateIndex', true);

// mongoose.connect(MONGO_URL, {
//   auth: {
//     user: username,
//     password: password
//   },
//   options
// });

mongoose.connection.on('connected', () => {
  // eslint-disable-next-line no-console
  console.info(`Connected to MongoDB`);
});
mongoose.connection.on('error', err => {
  // eslint-disable-next-line no-console
  console.error(`MongoDB connection error:`, err);
  process.exit(-1);
});

mongoose.connection.on('disconnected', () => {
  // eslint-disable-next-line no-console
  console.error('MongoDB disconnected');
});

export default mongoose;
