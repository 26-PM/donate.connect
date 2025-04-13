const express = require('express');
const router = express.Router();
const { createDonation, getUserDonations, getDonationById, getNgoDonations, updateDonationStatus } = require('../Controllers/donationController');

// Create a new donation
router.post('/donate', createDonation);

// Get all donations for a user
router.get('/user/:userId', getUserDonations);
router.get('/ngo/:ngoId', getNgoDonations);

// Get a specific donation
router.get('/:id/:userId', getDonationById);

// Update donation status
router.put('/:id/status', updateDonationStatus);

module.exports = router;
