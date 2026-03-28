const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');

router.post('/', bookingsController.createBooking);
router.get('/', bookingsController.listBookings);
router.delete('/:id', bookingsController.cancelBooking);

module.exports = router;
