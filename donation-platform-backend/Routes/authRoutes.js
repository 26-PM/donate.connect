const express = require("express");
const router = express.Router();
const {
  signupUser,
  signupNGO,
  login,
  logout,
} = require("../Controllers/authController");

router.post("/signup/user", signupUser);
router.post("/signup/ngo", signupNGO);
router.post("/login/", login);
router.get("/logout", logout);

module.exports = router;
