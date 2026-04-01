const express = require('express');
const router = express.Router();
const { createRequest, getDonorRequests, getSentRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

// Protected route: Creating a new blood request
router.post('/create', protect, createRequest);

// Protected route: Getting all requests for the logged-in donor
router.get('/received', protect, getDonorRequests);
router.get('/my-requests', protect, getSentRequests);

// Protected route: Updating request status (Accept/Reject)
router.patch('/:requestId/status', protect, updateRequestStatus);

module.exports = router;
