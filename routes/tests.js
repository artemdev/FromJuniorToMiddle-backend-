const express = require("express");
const router = express.Router();

const guard = require("../helpers/guard");
const {
  createTechResult,
  getTechResult,
  removeResult,
  createTheoryResult,
  getTheoryResult,
} = require("../controllers/tests");

const path = require("path");
const { listRandomTests } = require("../helpers/parseQuestions");

const testingTheory = path.join(__dirname, "../db/testingTheory.json");
const technicalQA = path.join(__dirname, "../db/technicalQA.json");

/* GET users listing. */
router.get("/technical/random", async (_req, res, next) => {
  try {
    const tests = await listRandomTests(technicalQA);
    return res.json({
      status: "success",
      code: 200,
      data: {
        tests,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/theory/random", async (_req, res, next) => {
  try {
    const tests = await listRandomTests(testingTheory);
    return res.json({
      status: "success",
      code: 200,
      data: {
        tests,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.post("/technical", guard, createTechResult);
router.post("/theory", guard, createTheoryResult);
router.get("/technical", guard, getTechResult);
router.get("/theory", guard, getTheoryResult);
router.delete("/technical", guard, removeResult);
router.delete("/theory", guard, removeResult);

module.exports = router;
