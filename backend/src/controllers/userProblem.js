const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo");

/* ---------------- CREATE PROBLEM ---------------- */
const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution = [], // 🔥 make optional
    } = req.body;

    // 🧪 Run judge ONLY if referenceSolution is provided
    if (referenceSolution.length > 0) {
      for (const { language, completeCode } of referenceSolution) {
        const languageId = getLanguageById(language);

        const submissions = visibleTestCases.map((tc) => ({
          source_code: completeCode,
          language_id: languageId,
          stdin: tc.input,
          expected_output: tc.output,
        }));

        const submitResult = await submitBatch(submissions);
        const tokens = submitResult.map((r) => r.token);
        const testResult = await submitToken(tokens);

        for (const test of testResult) {
          if (test.status_id !== 3) {
            return res.status(400).send("Reference solution failed");
          }
        }
      }
    }

    await Problem.create({
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreator: req.result._id,
    });

    res.status(201).send("Problem Saved Successfully");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error: " + err.message);
  }
};

/* ---------------- UPDATE PROBLEM ---------------- */
const updateProblem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).send("Missing ID");

    const existingProblem = await Problem.findById(id);
    if (!existingProblem) {
      return res.status(404).send("Problem not found");
    }

    const updatedData = {
      title: req.body.title ?? existingProblem.title,
      description: req.body.description ?? existingProblem.description,
      difficulty: req.body.difficulty ?? existingProblem.difficulty,
      tags: req.body.tags ?? existingProblem.tags,
      visibleTestCases:
        req.body.visibleTestCases ?? existingProblem.visibleTestCases,
      hiddenTestCases:
        req.body.hiddenTestCases ?? existingProblem.hiddenTestCases,
      startCode: req.body.startCode ?? existingProblem.startCode,
      referenceSolution:
        req.body.referenceSolution ?? existingProblem.referenceSolution,
    };

    // 🧪 Validate again ONLY if changed
    if (req.body.referenceSolution || req.body.visibleTestCases) {
      if (updatedData.referenceSolution?.length > 0) {
        for (const {
          language,
          completeCode,
        } of updatedData.referenceSolution) {
          const languageId = getLanguageById(language);

          const submissions = updatedData.visibleTestCases.map((tc) => ({
            source_code: completeCode,
            language_id: languageId,
            stdin: tc.input,
            expected_output: tc.output,
          }));

          const submitResult = await submitBatch(submissions);
          const tokens = submitResult.map((r) => r.token);
          const testResult = await submitToken(tokens);

          for (const test of testResult) {
            if (test.status_id !== 3) {
              return res.status(400).send("Reference solution failed");
            }
          }
        }
      }
    }

    const updatedProblem = await Problem.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedProblem);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

/* ---------------- DELETE PROBLEM ---------------- */
const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).send("ID is Missing");

    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deletedProblem) {
      return res.status(404).send("Problem is Missing");
    }

    res.status(200).send("Successfully Deleted");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

/* ---------------- GET PROBLEM BY ID ---------------- */
const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).send("ID is Missing");

    const problem = await Problem.findById(id).select(
      "_id title description difficulty tags visibleTestCases startCode referenceSolution"
    );

    if (!problem) return res.status(404).send("Problem is Missing");

    const video = await SolutionVideo.findOne({ problemId: id });

    if (video) {
      return res.status(200).json({
        ...problem.toObject(),
        secureUrl: video.secureUrl,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
      });
    }

    res.status(200).json(problem);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

/* ---------------- GET ALL PROBLEMS ---------------- */
const getAllProblem = async (req, res) => {
  try {
    const problems = await Problem.find({}).select("_id title difficulty tags");

    if (!problems.length) {
      return res.status(404).send("Problem is Missing");
    }

    res.status(200).json(problems);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

/* ---------------- SOLVED PROBLEMS BY USER ---------------- */
const solvedAllProblembyUser = async (req, res) => {
  try {
    const user = await User.findById(req.result._id).populate({
      path: "problemSolved",
      select: "_id title difficulty tags",
    });

    res.status(200).json(user.problemSolved);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

/* ---------------- SUBMITTED PROBLEMS ---------------- */
const submittedProblem = async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.result._id,
      problemId: req.params.pid,
    });

    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  solvedAllProblembyUser,
  submittedProblem,
};
