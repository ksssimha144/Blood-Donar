const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  bloodGroup: {
    type: String,
    required: [true, 'Please add a blood group'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  area: {
    type: String,
    required: [true, 'Please add a city'],
    trim: true,
  },
  subArea: {
    type: String,
    required: [true, 'Please add a sub-area'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true,
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Please add latitude'],
    },
    lng: {
      type: Number,
      required: [true, 'Please add longitude'],
    },
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Donor', donorSchema);
