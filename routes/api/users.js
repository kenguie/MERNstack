const express = require('express');
const router = express.Router();

// using below actually routes to /api/users/test - reminder

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works'}));  // return JSON data

module.exports = router;