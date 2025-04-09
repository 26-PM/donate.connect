const express = require("express");
const router = express.Router();
const {
  signupUser,
  signupNGO,
  loginUser,
  loginNGO,
  logout,
} = require("../Controllers/authController");

router.post("/signup/user", signupUser);
router.post("/signup/ngo", signupNGO);
router.post("/login/user", loginUser);
router.post("/login/ngo", loginNGO);
router.post("/logout", logout);

module.exports = router;
