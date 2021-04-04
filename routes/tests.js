const express = require("express");
const router = express.Router();
const path = require("path");
const TheoryTests = require("../model/questions");

const testingTheory = path.join(__dirname, "../db/testingTheory.json");
const technicalQA = path.join(__dirname, "../db/technicalQA.json");

/* GET users listing. */
router.get("/technicalQA", async (_req, res, next) => {
  try {
    const tests = await TheoryTests.listRandomTests(technicalQA);
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

router.get("/testingTheory", async (_req, res, next) => {
  try {
    const tests = await TheoryTests.listRandomTests(testingTheory);
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

module.exports = router;
