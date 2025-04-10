const express = require("express");
const router = express.Router();
const { getAllNGOs, getNGOById } = require("../Controllers/userSideController");

// Get all NGOs
router.get("/ngos", getAllNGOs);

// Get single NGO by ID
router.get("/ngos/:id", getNGOById);

module.exports = router; 