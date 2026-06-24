const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  sendRequest,
  getReceivedRequests,
  updateRequestStatus,
  getSentRequests
} = require("../controllers/requestController");

router.post("/", auth, sendRequest);
router.get("/received", auth, getReceivedRequests);
router.get("/sent", auth, getSentRequests);
router.put("/:id", auth, updateRequestStatus);

module.exports = router;