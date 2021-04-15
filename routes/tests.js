const express = require('express');
const router = express.Router();

const guard = require('../helpers/guard');
const {
  createTechResult,
  getTechResult,
  removeResult,
  createTheoryResult,
  getTheoryResult,
} = require('../controllers/tests');

const path = require('path');
const Tests = require('../helpers/parseQuestions');

const testingTheory = path.join(__dirname, '../db/testingTheory.json');
const technicalQA = path.join(__dirname, '../db/technicalQA.json');

/* GET users listing. */
router.get('/technicalQA', async (_req, res, next) => {
  try {
    const tests = await Tests.listRandomTests(technicalQA);
    return res.json({
      status: 'success',
      code: 200,
      data: {
        tests,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get('/testingTheory', async (_req, res, next) => {
  try {
    const tests = await Tests.listRandomTests(testingTheory);
    return res.json({
      status: 'success',
      code: 200,
      data: {
        tests,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get('/technicalQA/result', guard, getTechResult);
router.post('/technicalQA/result', guard, createTechResult);
router.delete('/technicalQA/result', guard, removeResult);

// router.get('/testingTheory/result', guard, getTheoryResult);
// router.post('/testingTheory/result', guard, createTheoryResult);
// router.delete('/testingTheory/result', guard, removeResult);

module.exports = router;
