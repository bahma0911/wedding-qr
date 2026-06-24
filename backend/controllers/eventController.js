const QRCode = require('qrcode');
const Event = require('../models/Event');
const User = require('../models/User');

const createEvent = async (req, res) => {
  try {
    const { title, brideName, groomName, date, location, coverImage } = req.body;
    const organizerId = req.userId;
    const userRole = req.userRole;

    if (userRole !== 'organizer' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Only organizers and admins can create events' });
    }

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

    const clientUrl = process.env.CLIENT_URL || 'https://wedding-qr-front.onrender.com';
    const uploadUrl = `${clientUrl}/event/${event._id}/upload`;
    const qrCodeDataUrl = await QRCode.toDataURL(uploadUrl);

    event.qrCodeUrl = qrCodeDataUrl;
    await event.save();

    await User.findByIdAndUpdate(organizerId, { $push: { createdEvents: event._id } });

    res.status(201).json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Could not create event', error: error.message });
  }
};

const grantOrganizerRole = async (req, res) => {
  try {
    const userRole = req.userRole;
    const { userId } = req.body;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admins can grant organizer role' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'organizer' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Organizer role granted successfully', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Could not grant organizer role', error: error.message });
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

const getUsers = async (req, res) => {
  try {
    const userRole = req.userRole;
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view users' });
    }

    const users = await User.find({}, 'name email role').sort({ role: 1, name: 1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
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

module.exports = { createEvent, grantOrganizerRole, getEventById, getEventsByUser, getUsers };
