const express = require("express");
const router = express.Router();

const guard = require("../helpers/guard");
const {
  createResultQA,
  removeResultQA,
} = require("../controllers/testing/technicalQA");
const {
  createResultTheory,
  removeResultTheory,
} = require("../controllers/testing/testingTheory");

const path = require("path");
const Tests = require("../model/questions");

const testingTheory = path.join(__dirname, "../db/testingTheory.json");
const technicalQA = path.join(__dirname, "../db/technicalQA.json");

/* GET users listing. */
router.get("/technicalQA", async (_req, res, next) => {
  try {
    const tests = await Tests.listRandomTests(technicalQA);
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
    const tests = await Tests.listRandomTests(testingTheory);
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

router.post("/technicalQA", guard, createResultQA);
router.delete("/technicalQA", guard, removeResultQA);

router.post("/testingTheory", guard, createResultTheory);
router.delete("/testingTheory", guard, removeResultTheory);

module.exports = router;
