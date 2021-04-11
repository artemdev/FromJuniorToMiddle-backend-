const path = require("path");
const TestsList = require("../../model/questions");
const { httpCode } = require("../../helpers/constants");
const Testing = require("../../model/technicalQA");
const EmailService = require("../../services/email");

const technicalQADb = path.join(__dirname, "../../db/technicalQA.json");

const createResultQA = async (req, res, next) => {
  try {
    const { id, email, name } = req.user;
    const userAnswers = req.body;
    const questions = [];
    const testsList = await TestsList.listAllTests(technicalQADb);
    const dataToCheck = testsList.map(
      ({ questionId, question, rightAnswer }) => ({
        questionId,
        question,
        rightAnswer,
      })
    );

    userAnswers.forEach((answer) => {
      if (
        dataToCheck.find(
          (data) =>
            answer.questionId === data.questionId &&
            answer.userAnswer === data.rightAnswer
        )
      ) {
        questions.push({
          questionId: answer.questionId,
          question: answer.question,
          answer: answer.userAnswer,
          rightAnswer: true,
        });
      } else {
        questions.push({
          questionId: answer.questionId,
          question: answer.question,
          answer: answer.userAnswer,
          rightAnswer: false,
        });
      }
    });

    const correctAnswers = questions.filter((el) => el.rightAnswer === true);

    const technicalQA = await Testing.addResult({
      type: "technicalQA",
      questions,
      total: questions.length,
      correctAnswers: correctAnswers.length,
      owner: id,
      email,
      name,
    });

    if (technicalQA) {
      const emailService = new EmailService(process.env.NODE_ENV);
      await emailService.sendEmail(email, technicalQA);

      return res.status(httpCode.CREATED).json({
        status: "success",
        code: httpCode.CREATED,
        data: {
          type: technicalQA.type,
          questions: technicalQA.questions,
          total: technicalQA.total,
          correctAnswers: technicalQA.correctAnswers,
          owner: technicalQA.owner,
          mail: technicalQA.email,
          name: technicalQA.name,
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

const removeResultQA = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const technicalQA = await Testing.deleteResult(userId);

    if (technicalQA) {
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
  createResultQA,
  removeResultQA,
};
