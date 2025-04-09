const express = require('express');
const router = express.Router();
const { createDonation } = require('../Controllers/donationController');
const auth = require('../middleware/auth');

router.post('/donate', auth, createDonation);

module.exports = router;
