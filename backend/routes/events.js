const express = require('express');
const { createEvent, grantOrganizerRole, getEventById, getEventsByUser, getUsers } = require('../controllers/eventController');
const auth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/create', auth, roleMiddleware('organizer', 'admin'), createEvent);
router.post('/grant-organizer', auth, roleMiddleware('admin'), grantOrganizerRole);
router.get('/users', auth, roleMiddleware('admin'), getUsers);
router.get('/:id', getEventById);
router.get('/user/:userId', auth, getEventsByUser);

module.exports = router;
