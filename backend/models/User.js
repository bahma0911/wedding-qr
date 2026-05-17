const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'organizer', 'admin'], default: 'user' },
  createdEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);
