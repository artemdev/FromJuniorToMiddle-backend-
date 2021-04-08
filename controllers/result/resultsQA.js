const path = require("path");
const Tests = require("../../model/questions");
const { httpCode } = require("../../helpers/constants");
const ResultQA = require("../../model/resultsQA");

const technicalQA = path.join(__dirname, "../../db/technicalQA.json");

const saveResultQA = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userAnswers = req.body;
    const userRA = [];
    const testsList = await Tests.listAllTests(technicalQA);
    const dataToCheck = testsList.map(({ questionId, rightAnswer }) => ({
      questionId,
      rightAnswer,
    }));

    userAnswers.forEach((answer) => {
      if (
        dataToCheck.find(
          (data) =>
            answer.questionId === data.questionId &&
            answer.userAnswer === data.rightAnswer
        )
      ) {
        userRA.push({ answerId: answer.questionId, answer: answer.userAnswer });
      }
    });

    const resultQA = await ResultQA.addResult({
      userRA,
      owner: userId,
    });
    if (resultQA) {
      return res.status(httpCode.CREATED).json({
        status: "success",
        code: httpCode.CREATED,
        data: {
          resultQA,
        },
      });
    } else {
      return res.status(httpCode.BAD_REQUEST).json({
        status: "error",
        code: httpCode.BAD_REQUEST,
        message: "Not Found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const getResultQA = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resultQA = await ResultQA.findResultByUserId(userId);

    if (resultQA) {
      return res.status(httpCode.OK).json({
        status: "success",
        code: httpCode.OK,
        data: {
          resultQA,
        },
      });
    } else {
      return res.status(httpCode.NOT_FOUND).json({
        status: "error",
        code: httpCode.NOT_FOUND,
        message: "Not Found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const removeResultQA = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resultQA = await ResultQA.removeResult(userId);

    if (resultQA) {
      return res.status(httpCode.OK).json({
        status: "success",
        code: httpCode.OK,
        message: "Results deleted",
      });
    } else {
      return res.status(httpCode.NOT_FOUND).json({
        status: "error",
        code: httpCode.NOT_FOUND,
        message: "Not Found",
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  saveResultQA,
  getResultQA,
  removeResultQA,
};
