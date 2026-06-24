const Request = require("../models/Request");

// SEND REQUEST
exports.sendRequest = async (req, res) => {
  try {
    const { toUserId, skillOffered, skillWanted } = req.body;

    const request = await Request.create({
      fromUser: req.user._id,
      toUser: toUserId,
      skillOffered,
      skillWanted,
    });

    res.status(201).json(request);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RECEIVED REQUESTS
exports.getReceivedRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      toUser: req.user._id
    }).populate("fromUser", "name skills");

    res.json(requests);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SENT REQUESTS (NEW)
exports.getSentRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      fromUser: req.user._id
    }).populate("toUser", "name skills");

    res.json(requests);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE STATUS
exports.updateRequestStatus = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Not found" });
    }

    if (request.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    request.status = req.body.status;
    await request.save();

    res.json(request);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};