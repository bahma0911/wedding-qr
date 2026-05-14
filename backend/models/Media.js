const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: String, default: 'guest' },
  publicId: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Media', MediaSchema);
