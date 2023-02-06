const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const contactsRouter = require('./routes/api/contacts');
const usersRouter = require("./routes/api/users");

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use('/api/contacts', contactsRouter);
app.use('/api/user', usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found (error App.js)' })
})

app.use((error, req, res, next) => {
   res.status(500).json({
      status:"fail",
      message: error.message
   })
})

module.exports = app;
