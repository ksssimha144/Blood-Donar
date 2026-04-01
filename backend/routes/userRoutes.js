const express = require('express');
const router = express.Router();
const { getUsers, addSampleUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Protected route: Getting ALL donors (Admin/System only)
router.get('/', protect, getUsers);

// Protected route: Adding a sample donor
router.post('/add', protect, addSampleUser);

module.exports = router;
