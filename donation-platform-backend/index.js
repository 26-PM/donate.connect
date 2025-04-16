const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./Config/db");
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

// CORS Configuration
const allowedOrigins = [
  'https://donateconnect-kye5bxpmj-26-pms-projects.vercel.app',
  'https://donateconnect.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./Routes/authRoutes");
app.use("/api/auth", authRoutes);

const donationRoutes = require("./Routes/donation");
app.use("/api/donations", donationRoutes);

const userSideRoutes = require("./Routes/userSideRoutes");
app.use("/api/user", userSideRoutes);

const testimonialRoutes = require("./Routes/testimonialRoutes");
app.use("/api", testimonialRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
