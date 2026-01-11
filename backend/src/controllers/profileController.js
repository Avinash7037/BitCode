const User = require("../models/user");
const Submission = require("../models/submission");
const Problem = require("../models/problem");

// GET /user/profile
exports.getProfile = async (req, res) => {
  try {
    const user = req.result;

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      age: user.age,
      role: user.role,
      createdAt: user.createdAt,
      problemSolved: user.problemSolved.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /user/stats
exports.getStats = async (req, res) => {
  try {
    const userId = req.result._id;

    const submissions = await Submission.find({ userId }).populate("problemId");

    let accepted = 0;
    let total = submissions.length;
    let easy = 0,
      medium = 0,
      hard = 0;

    submissions.forEach((s) => {
      if (s.status === "accepted") {
        accepted++;
        const diff = s.problemId.difficulty;
        if (diff === "easy") easy++;
        else if (diff === "medium") medium++;
        else if (diff === "hard") hard++;
      }
    });

    res.json({
      totalSubmissions: total,
      accepted,
      accuracy: total === 0 ? 0 : Math.round((accepted / total) * 100),
      easy,
      medium,
      hard,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /user/profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, age } = req.body;
    const userId = req.result._id;

    const updated = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, age },
      { new: true }
    );

    res.json({
      message: "Profile updated",
      user: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
