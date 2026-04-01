const Donor = require('../models/Donor');

// @desc    Get all users (as Donors)
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res, next) => {
  try {
    const users = await Donor.find({});
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a sample user (as Donor)
// @route   POST /api/users/add
// @access  Public
const addSampleUser = async (req, res, next) => {
  try {
    const { name, bloodGroup, location } = req.body;

    if (!name || !bloodGroup || !location) {
      res.status(400);
      throw new Error('Please provide name, blood group, and location');
    }

    const user = await Donor.create({
      name,
      bloodGroup,
      location,
    });

    res.status(201).json({
      success: true,
      message: 'Sample user added successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  addSampleUser,
};
