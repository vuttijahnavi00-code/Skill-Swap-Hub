const User = require("../models/User");

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { skills, bio } = req.body;

    if (skills) user.skills = skills;
    if (bio) user.bio = bio;

    await user.save();

    res.json({
      message: "Profile updated",
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET USERS (SAFE)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id }
    }).select("-password");

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SEARCH USERS
exports.searchUsersBySkill = async (req, res) => {
  try {
    const { skill } = req.query;

    const users = await User.find({
      _id: { $ne: req.user._id },
      skills: skill ? { $in: [skill] } : { $exists: true }
    }).select("-password");

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};