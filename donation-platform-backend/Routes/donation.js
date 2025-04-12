const express = require('express');
const router = express.Router();
const { createDonation, getUserDonations, getDonationById } = require('../Controllers/donationController');

// Create a new donation
router.post('/donate', createDonation);

// Get all donations for a user
router.get('/user/:userId', getUserDonations);

// Get a specific donation
router.get('/:id/:userId', getDonationById);

module.exports = router;
