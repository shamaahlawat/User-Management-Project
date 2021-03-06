import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressValidator from 'express-validator';
import sendResponse from './utils/sendResponse';
import apiRoutes from './routes';
import './db';

const app = express();
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(
  expressValidator({
    customValidators: {
      isDate: value => !isNaN(Date.parse(value))
    }
  })
);

// Routes
app.use('/', apiRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  sendResponse(res, 404, {}, err.message);
  next();
});

export default app;
