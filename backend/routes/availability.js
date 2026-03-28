const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

router.post('/', availabilityController.saveAvailability);
router.get('/', availabilityController.getAvailability);

module.exports = router;
