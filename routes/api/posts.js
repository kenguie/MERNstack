const express = require('express');
const router = express.Router();

// using below actually routes to /api/users/test - reminder

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works'}));  // return JSON data

module.exports = router;