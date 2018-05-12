const express = require('express');
const router = express.Router();

// using below actually routes to /api/users/test - reminder

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works'}));  // return JSON data

module.exports = router;