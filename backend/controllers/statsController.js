const User = require("../models/User");
const Request = require("../models/Request");

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: "pending" });

    res.json({
      totalUsers,
      totalRequests,
      pendingRequests,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};