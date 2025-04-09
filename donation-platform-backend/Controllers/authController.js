const User = require("../Models/Users");
const NGO = require("../Models/Ngo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ---------------- USER SIGNUP ----------------
const signupUser = async (req, res) => {
  try {
    const { email, password, mobile } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed, mobile });

    res.status(201).json({ msg: "User signup successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ---------------- NGO SIGNUP ----------------
const signupNGO = async (req, res) => {
  try {
    const {
      name,
      registrationNumber,
      email,
      password,
      mobile,
      streetNumber,
      landmark,
      city,
      state,
      country,
      pincode,
      itemsAccepted,
    } = req.body;

    const exists = await NGO.findOne({ email });
    if (exists) return res.status(400).json({ msg: "NGO already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await NGO.create({
      name,
      registrationNumber,
      email,
      password: hashed,
      mobile,
      address: { streetNumber, landmark, city, state, country, pincode },
      itemsAccepted,
    });

    res.status(201).json({ msg: "NGO signup successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ---------------- USER LOGIN ----------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, type: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ msg: "Login successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ---------------- NGO LOGIN ----------------
const loginNGO = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ngo = await NGO.findOne({ email: email.trim().toLowerCase() });
    if (!ngo) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, ngo.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: ngo._id, type: "ngo" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ msg: "Login successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ---------------- LOGOUT ----------------
const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    .json({ msg: "Logged out successfully" });
};

module.exports = {
  signupUser,
  signupNGO,
  loginUser,
  loginNGO,
  logout,
};
