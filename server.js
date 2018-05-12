const express = require('express');
const mongoose = require('mongoose');

const app = express();

// DB 
const db = require('./config/keys').mongoURI;

// Connect to Mongo DB via mongoose and promise
mongoose
  .connect(db)
  .then(() => console.log('Mongo DB Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hi!'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));


