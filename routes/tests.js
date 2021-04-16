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

const {
  getTechnicalRandomTests,
  getTheoryRandomTests,
} = require("../controllers/randomTests");

/* GET users listing. */
router.get("/technical/random", getTechnicalRandomTests);
router.get("/theory/random", getTheoryRandomTests);
router.post("/technical", guard, createTechResult);
router.post("/theory", guard, createTheoryResult);
router.get("/technical", guard, getTechResult);
router.get("/theory", guard, getTheoryResult);
router.delete("/technical", guard, removeResult);
router.delete("/theory", guard, removeResult);

module.exports = router;
