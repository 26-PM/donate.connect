const NGO = require("../Models/Ngo");

// Fetch all NGOs
const getAllNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find({}, {
      name: 1,
      registrationNumber: 1,
      email: 1,
      mobile: 1,
      address: 1,
      itemsAccepted: 1,
      createdAt: 1
    }).sort({ createdAt: -1 });
    console.log(ngos)
    res.status(200).json({
      success: true,
      count: ngos.length,
      data: ngos
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching NGOs",
      error: err.message
    });
  }
};

module.exports = {
  getAllNGOs
}; 