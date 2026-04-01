const express = require('express');
const router = express.Router();
const { getNearbyDonors, registerDonor, getMyDonorStatus } = require('../controllers/donorController');
const { protect } = require('../middleware/authMiddleware');

// Public route: Searching for donors
router.post('/nearby', getNearbyDonors);

// Protected route: Registering as a donor
router.post('/', protect, registerDonor);

// Get current donor status (for session healing)
router.get('/me', protect, getMyDonorStatus);

module.exports = router;
