const User = require("../models/user");
const Submission = require("../models/submission");

/* ---------------- GET PROFILE ---------------- */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.result._id);

    const uniqueSolved = new Set(user.problemSolved.map((p) => p.toString()))
      .size;

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      age: user.age,
      role: user.role,
      createdAt: user.createdAt,
      problemSolved: uniqueSolved, // ✅ always unique
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ---------------- GET STATS ---------------- */
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.result._id).populate("problemSolved");

    let easy = 0,
      medium = 0,
      hard = 0;

    // Count unique solved problems by difficulty
    user.problemSolved.forEach((problem) => {
      if (problem.difficulty === "easy") easy++;
      else if (problem.difficulty === "medium") medium++;
      else if (problem.difficulty === "hard") hard++;
    });

    const totalSolved = user.problemSolved.length;

    // Submission stats (for accuracy only)
    const submissions = await Submission.find({ userId: user._id });
    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(
      (s) => s.status === "accepted"
    ).length;

    const accuracy =
      totalSubmissions === 0
        ? 0
        : Math.round((acceptedSubmissions / totalSubmissions) * 100);

    res.json({
      totalSubmissions,
      accuracy,
      easy,
      medium,
      hard,
      totalSolved, // ✅ this is what frontend uses
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ---------------- UPDATE PROFILE ---------------- */
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
