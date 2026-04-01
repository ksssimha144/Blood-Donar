const Request = require('../models/Request');
const Donor = require('../models/Donor');

// @desc    Create a new blood request
// @route   POST /api/requests/create
// @access  Private
const createRequest = async (req, res, next) => {
  try {
    const { donorId, bloodGroup, area } = req.body;

    if (!donorId || !bloodGroup || !area) {
      res.status(400);
      throw new Error('Please provide all required fields (donorId, bloodGroup, area)');
    }

    // Automatically use the logged-in user as the requester
    const request = await Request.create({
      donorId,
      requesterId: req.user._id,
      requesterName: req.user.name,
      bloodGroup,
      area,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests for the logged-in donor
// @route   GET /api/requests/me
// @access  Private
const getDonorRequests = async (req, res, next) => {
  try {
    // 1. Find the donor profile associated with this user
    const donorProfile = await Donor.findOne({ userId: req.user._id });

    if (!donorProfile) {
      // If the user isn't a donor, they have no incoming requests
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    // 2. Fetch requests for this specific donor ID
    const requests = await Request.find({ donorId: donorProfile._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests created by the logged-in user
// @route   GET /api/requests/sent
// @access  Private
const getSentRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ requesterId: req.user._id })
      .populate('donorId', 'name bloodGroup area subArea') // Optional: Show donor info
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blood request status
// @route   PATCH /api/requests/:requestId/status
// @access  Private
const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status. Must be pending, accepted, or rejected');
    }

    const request = await Request.findById(req.params.requestId);

    if (!request) {
      res.status(404);
      throw new Error('Request not found');
    }

    // Authorization: Only the donor who received the request can update it
    const donorProfile = await Donor.findOne({ userId: req.user._id });
    if (!donorProfile || request.donorId.toString() !== donorProfile._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this request');
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getDonorRequests,
  getSentRequests,
  updateRequestStatus,
};
