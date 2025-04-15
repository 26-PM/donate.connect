const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./Config/db");
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ['https://donateconnect-kye5bxpmj-26-pms-projects.vercel.app', 'https://donateconnect.vercel.app/', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true // if using cookies or Authorization headers
}));


const authRoutes = require("./Routes/authRoutes");
app.use("/api/auth", authRoutes);

const donationRoutes = require("./Routes/donation");
app.use("/api/donations", donationRoutes);

const userSideRoutes = require("./Routes/userSideRoutes");
app.use("/api/user", userSideRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
