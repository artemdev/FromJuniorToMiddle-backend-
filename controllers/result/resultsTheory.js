const path = require("path");
const Tests = require("../../model/questions");
const { httpCode } = require("../../helpers/constants");
const ResultTheory = require("../../model/resultsTheory");

const testingTheory = path.join(__dirname, "../../db/testingTheory.json");

const saveResultTheory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userAnswers = req.body;
    const userRA = [];
    const testsList = await Tests.listAllTests(testingTheory);
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
        userRA.push({
          answerId: answer.questionId,
          answer: answer.userAnswer,
        });
      }
    });

    const resultTheory = await ResultTheory.addResultTheory({
      userRA,
      owner: userId,
    });
    if (resultTheory) {
      return res.status(httpCode.CREATED).json({
        status: "success",
        code: httpCode.CREATED,
        data: {
          resultTheory,
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

const getResultTheory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resultTheory = await ResultTheory.findResultByUserId(userId);

    if (resultTheory) {
      return res.status(httpCode.OK).json({
        status: "success",
        code: httpCode.OK,
        data: {
          resultTheory,
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

const removeResultTheory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resultTheory = await ResultTheory.removeResult(userId);

    if (resultTheory) {
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
  saveResultTheory,
  getResultTheory,
  removeResultTheory,
};
