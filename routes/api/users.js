const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load the User model
const User = require('../../models/User');

// using below actually routes to /api/users/test - reminder

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works'}));  // return JSON data

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).json({email: 'Email already exists'});
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', // size
          r: 'pg', // rating
          d: 'mm' // default image 
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) { throw err; };
            newUser.password = hash;
            newUser.save() // mongoose
              .then(user => res.json(user))
              .catch(err => console.log(err)); 
          })
        })
      }
    })
});

// @route   GET api/users/login
// @desc    Login User / Return JWT token
// @access  Public
router.post('/login', (req, res) => {
  const email = req.body.email; // from form
  const password = req.body.password; 

  // find user by email
  User.findOne({email})
    .then(user => {
      // Check for the user
      if (!user) {
        return res.status(404).json({email: 'User not found'});
      }

      // Check Password 
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // res.json({msg: 'Success'}); // old test
            
            // User Matched 
            const payload = { id: user.id, name: user.name, avatar: user.avatar } // the JWT Payload

            // Sign Token 
            jwt.sign(
              payload, 
              keys.secretOrKey, 
              { expiresIn: 3600 }, 
              (err, token) => {
                res.json({ 
                  success: true, 
                  token: `Bearer ${token}`
                });
              }
            );
          } else {
            return res.status(400).json({password: 'Password incorrect'});
          }
        })
    })
})

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  // res.json({msg: 'Success'}); // test
  // res.json(req.user); // password hash is included here, you don't actually want that in the response, let's create just what we want
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;