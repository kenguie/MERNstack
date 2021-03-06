const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// Body parser middleware needed
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB 
const db = require('./config/keys').mongoURI;

// Connect to Mongo DB via mongoose and promise
mongoose
  .connect(db)
  .then(() => console.log('Mongo DB Connected'))
  .catch(err => console.log(err));

// app.get('/', (req, res) => res.send('Hi!'));

// Passport Config 
require('./config/passport')(passport);

// Use Routes 
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));


