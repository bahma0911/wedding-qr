const multer = require('multer');
const Media = require('../models/Media');
const Event = require('../models/Event');
const { uploadToCloudinary } = require('../utils/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 120 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Unsupported file type'));
    }
    cb(null, true);
  },
});

const uploadMedia = async (req, res) => {
  upload.single('file')(req, res, async err => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    try {
      const eventId = req.params.eventId;
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No media file provided' });
      }

      const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.mimetype, eventId);
      const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

      const media = await Media.create({
        eventId,
        mediaUrl: uploadResult.secure_url,
        mediaType,
        uploadedBy: req.body.uploadedBy || 'guest',
        publicId: uploadResult.public_id,
      });

      res.status(201).json({ media });
    } catch (error) {
      res.status(500).json({ message: 'Upload failed', error: error.message });
    }
  });
};

const getPhotosByEvent = async (req, res) => {
  try {
    const media = await Media.find({ eventId: req.params.eventId }).sort({ uploadedAt: -1 });
    res.json({ media });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch media', error: error.message });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const photo = await Media.findById(req.params.photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Media not found' });
    }

    if (photo.publicId) {
      const { destroy } = require('../utils/cloudinary');
      await destroy(photo.publicId);
    }

    await photo.deleteOne();
    res.json({ message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete media', error: error.message });
  }
};

module.exports = { uploadMedia, getPhotosByEvent, deletePhoto };
