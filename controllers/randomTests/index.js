const { listRandomTests } = require("../../helpers/parseQuestions");
const path = require("path");

const technicalQA = path.join(__dirname, "../../db/technicalQA.json");
const testingTheory = path.join(__dirname, "../../db/testingTheory.json");

const getTechnicalRandomTests = async (_req, res, next) => {
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
};

const getTheoryRandomTests = async (_req, res, next) => {
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
};

export { getTechnicalRandomTests, getTheoryRandomTests };
