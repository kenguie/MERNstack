const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

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
            res.json({msg: 'Success'});
          } else {
            return res.status(400).json({password: 'Password incorrect'});
          }
        })
    })
})

module.exports = router;