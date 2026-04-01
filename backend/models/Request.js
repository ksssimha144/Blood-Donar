const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true,
  },
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requesterName: {
    type: String,
    required: [true, 'Please add a requester name'],
    trim: true,
  },
  bloodGroup: {
    type: String,
    required: [true, 'Please add the blood group needed'],
  },
  area: {
    type: String,
    required: [true, 'Please add the area of the request'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Request', requestSchema);
