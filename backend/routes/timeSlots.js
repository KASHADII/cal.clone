const express = require('express');
const router = express.Router();
const timeSlotsController = require('../controllers/timeSlotsController');

router.get('/', timeSlotsController.getAvailableSlots);

module.exports = router;
