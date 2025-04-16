const express = require("express");
const router = express.Router();
const { getTestimonials, addTestimonial } = require("../Controllers/testimonialController");

// Route to fetch testimonials
router.get("/testimonials", getTestimonials);

// Route to post a new testimonial
router.post("/testimonials", addTestimonial);

module.exports = router;