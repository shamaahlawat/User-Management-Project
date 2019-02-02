import mongoose from 'mongoose';
import CONFIG from '../config';

const {
  // MONGODB_USERNAME: username,
  // MONGODB_PASSWORD: password,
  MONGODB_HOST: host,
  MONGODB_PORT: port,
  MONGODB_DATABASE_NAME: databaseName
} = CONFIG;

mongoose.Promise = global.Promise;

const MONGODB_URI = `mongodb://${host}:${port}/${databaseName}`;
const options = {
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  useNewUrlParser: true
};

mongoose.connect(
  MONGODB_URI,
  options
);

mongoose.connection.on('connected', () => {
  console.info(`Connected to MongoDB`);
});
mongoose.connection.on('error', err => {
  console.error(`MongoDB connection error:`, err);
  process.exit(-1);
});

mongoose.connection.on('disconnected', () => {
  console.error('MongoDB disconnected');
});

export default mongoose;
