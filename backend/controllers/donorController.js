const Donor = require('../models/Donor');

/**
 * Calculates the distance between two points in km using the Haversine formula.
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// @desc    Find nearby blood donors
// @route   POST /api/donors/nearby
// @access  Public
const getNearbyDonors = async (req, res, next) => {
  try {
    const { lat, lng, bloodGroup, area, subArea } = req.body;

    if (!bloodGroup || !area || !subArea) {
      res.status(400);
      throw new Error('Please provide blood group, area and sub-area');
    }

    // 1. Fetch available donors with area, subArea and optional blood group
    const query = {
      area,
      isAvailable: true,
    };

    if (bloodGroup !== 'All') {
      query.bloodGroup = bloodGroup;
    }

    if (subArea !== 'All') {
      query.subArea = subArea;
    }

    const donors = await Donor.find(query);

    // 2. Attach distance if user location is provided (No filtering)
    const resultDonors = donors.map((donor) => {
      if (lat && lng) {
        const distance = calculateDistance(
          lat,
          lng,
          donor.location.lat,
          donor.location.lng
        );
        donor._doc.distance = parseFloat(distance.toFixed(2));
      } else {
        donor._doc.distance = 'N/A';
      }
      return donor;
    });

    res.status(200).json({
      success: true,
      count: resultDonors.length,
      data: resultDonors,
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Register as a new blood donor
// @route   POST /api/donors
// @access  Private
const registerDonor = async (req, res, next) => {
  try {
    const { name, bloodGroup, area, subArea, phone, isAvailable } = req.body;

    if (!name || !bloodGroup || !area || !subArea || !phone) {
      res.status(400);
      throw new Error('Please provide all required donor information');
    }

    // Check if donor profile already exists for this user
    const existingDonor = await Donor.findOne({ userId: req.user._id });
    if (existingDonor) {
      res.status(400);
      throw new Error('You have already registered as a donor');
    }

    // Default city coordinates for new registrations (Center point)
    const cityCenters = {
      'Hyderabad': { lat: 17.3850, lng: 78.4867 },
      'Bangalore': { lat: 12.9716, lng: 77.5946 },
      'Chennai': { lat: 13.0827, lng: 80.2707 },
      'Delhi': { lat: 28.6139, lng: 77.2090 },
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Kolkata': { lat: 22.5726, lng: 88.3639 },
      'Pune': { lat: 18.5204, lng: 73.8567 },
      'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
      'Jaipur': { lat: 26.9124, lng: 75.7873 },
      'Surat': { lat: 21.1702, lng: 72.8311 },
    };

    const center = cityCenters[area] || { lat: 20.5937, lng: 78.9629 }; // Fallback to India center
    const jitterLat = (Math.random() - 0.5) * 0.05;
    const jitterLng = (Math.random() - 0.5) * 0.05;

    const donor = await Donor.create({
      userId: req.user._id, // Link to authenticated user
      name,
      bloodGroup,
      area,
      subArea,
      phone,
      isAvailable: isAvailable ?? true,
      location: {
        lat: center.lat + jitterLat,
        lng: center.lng + jitterLng,
      },
    });

    res.status(201).json({
      success: true,
      data: donor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's donor status
// @route   GET /api/donors/me
// @access  Private
const getMyDonorStatus = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    res.status(200).json({
      success: true,
      isDonor: !!donor,
      data: donor,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNearbyDonors,
  registerDonor,
  getMyDonorStatus,
};
