require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const rosterRouter = require('./roster/roster-router.js');
const sessionsRouter = require('./sessions/sessions-router.js');
const topicsRouter = require('./topics/topics-router.js');

const app = express();
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use( cors({ origin: CLIENT_ORIGIN }) );

app.use('/api/students', rosterRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/topics', topicsRouter);

app.get('/', (req, res) => {
  res.send('Hello, tutors and students!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    console.error(error);
     response = { error: { message: 'server error' }};
  } else {
    console.error(error);
    response = { error, message: error.message };
   }
   res.status(500).json(response);
 });

module.exports = app;