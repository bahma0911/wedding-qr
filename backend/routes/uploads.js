const express = require('express');
const { uploadMedia, getPhotosByEvent, deletePhoto } = require('../controllers/uploadController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:eventId', uploadMedia);
router.get('/:eventId', getPhotosByEvent);
router.delete('/:photoId', auth, deletePhoto);

module.exports = router;
