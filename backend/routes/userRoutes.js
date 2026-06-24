const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  getAllUsers,
  searchUsersBySkill,
} = require("../controllers/userController");

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

router.get("/", auth, getAllUsers);
router.get("/search", auth, searchUsersBySkill);

module.exports = router;