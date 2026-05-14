const express = require('express');
const { createEvent, getEventById, getEventsByUser } = require('../controllers/eventController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', auth, createEvent);
router.get('/:id', getEventById);
router.get('/user/:userId', auth, getEventsByUser);

module.exports = router;
