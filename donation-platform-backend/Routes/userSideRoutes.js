const express = require("express");
const router = express.Router();
const { getAllNGOs } = require("../Controllers/userSideController");

// Get all NGOs
router.get("/ngos", getAllNGOs);

module.exports = router; 