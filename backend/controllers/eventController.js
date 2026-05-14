const QRCode = require('qrcode');
const Event = require('../models/Event');
const User = require('../models/User');

const createEvent = async (req, res) => {
  try {
    const { title, brideName, groomName, date, location, coverImage } = req.body;
    const organizerId = req.userId;

    if (!title || !brideName || !groomName || !date || !location) {
      return res.status(400).json({ message: 'Missing required event fields' });
    }

    const event = await Event.create({
      title,
      brideName,
      groomName,
      date,
      location,
      coverImage,
      organizerId,
    });

    const uploadUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/event/${event._id}/upload`;
    const qrCodeDataUrl = await QRCode.toDataURL(uploadUrl);

    event.qrCodeUrl = qrCodeDataUrl;
    await event.save();

    await User.findByIdAndUpdate(organizerId, { $push: { createdEvents: event._id } });

    res.status(201).json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Could not create event', error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizerId', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event', error: error.message });
  }
};

const getEventsByUser = async (req, res) => {
  try {
    const organizerId = req.userId;
    const events = await Event.find({ organizerId }).sort({ createdAt: -1 });
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user events', error: error.message });
  }
};

module.exports = { createEvent, getEventById, getEventsByUser };
