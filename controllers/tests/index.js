const path = require("path");
const { parseTests } = require("../../helpers/parseQuestions");
const { httpCode } = require("../../helpers/constants");
const Tests = require("../../model/tests");
const EmailService = require("../../services/email");

const technicalQuestionsDb = path.join(__dirname, "../../db/technicalQA.json");
const theoryQuestionsDb = path.join(__dirname, "../../db/testingTheory.json");

const createTechResult = async (req, res, next) => {
  try {
    const { _id, email, name } = req.user;
    const userAnswers = req.body;
    const questions = [];
    const testsList = await parseTests(technicalQuestionsDb);
    // const dataToCheck = testsList.map(
    //   ({ questionId, question, rightAnswer }) => ({
    //     questionId,
    //     question,
    //     rightAnswer,
    //   })
    // );

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
        dataToCheck.find(
          (data) => {
            questions.push({
              questionId: answer.questionId,
              question: answer.question,
              answer: answer.userAnswer,
              rightAnswer: data.rightAnswer,
              isCorrect: true,
            });
          }
          // answer.questionId === data.questionId &&
          // answer.userAnswer === data.rightAnswer
        );
        // questions.push({
        //   questionId: answer.questionId,
        //   question: answer.question,
        //   answer: answer.userAnswer,
        //   rightAnswer: answer.rightAnswer,
        //   isCorrect: true,
        // });
      } else {
        questions.push({
          questionId: answer.questionId,
          question: answer.question,
          answer: answer.userAnswer,
          rightAnswer: answer.rightAnswer,
          isCorrect: false,
        });
      }
    });

    const correctAnswers = questions.filter((el) => el.rightAnswer === true);

    const technicalQA = await Tests.create({
      type: "technical",
      questions,
      total: questions.length,
      correctAnswers: correctAnswers.length,
      owner: _id,
      email,
      name,
    });

    if (technicalQA) {
      const questions = [
        ...technicalQA.questions.map((question) => ({
          answer: question.answer,
          rightAnswer: String(question.rightAnswer),
          question: question.question,
        })),
      ];

      const body = {
        total: technicalQA.total,
        questions: questions,
        name: technicalQA.name,
        correctAnswers: technicalQA.correctAnswers,
        rightAnswer: technicalQA.rightAnswer,
      };

<<<<<<< HEAD
=======
      console.log(body);
>>>>>>> dfe648ce1054870a7c4a7f65f6088384b13e766d
      // const emailService = new EmailService(process.env.NODE_ENV);
      // await emailService.sendEmail(email, body, technicalQA.type);

      return res.status(httpCode.CREATED).json({
        status: "success",
        code: httpCode.CREATED,
        data: body,
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

const getTechResult = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resultQA = await Tests.findTechResultByUserId(userId);

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

const removeResult = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const technicalQA = await Tests.deleteResult(userId);

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

const createTheoryResult = async (req, res, next) => {
  try {
    const { _id, email, name } = req.user;
    const userAnswers = req.body;
    const questions = [];
    const testsList = await parseTests(theoryQuestionsDb);
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
    const newQuestions = questions.map((question) => ({
      answer: question.answer,
      rightAnswer: question.rightAnswer,
      question: question.question,
    }));
    const technicalQA = await Tests.create({
      type: "theory",
      questions: newQuestions,
      total: questions.length,
      correctAnswers: correctAnswers.length,
      owner: _id,
      email,
      name,
    });

    const body = {
      total: technicalQA.total,
      questions: newQuestions,
      name: technicalQA.name,
      correctAnswers: technicalQA.correctAnswers,
    };
    // const emailService = new EmailService(process.env.NODE_ENV);
    // await emailService.sendEmail(email, body, technicalQA.type);

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
  } catch (e) {
    console.log(e);
  }
};

const getTheoryResult = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resultTheory = await Tests.findTheoryResultByUserId(userId);

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

module.exports = {
  createTechResult,
  getTechResult,
  removeResult,
  createTheoryResult,
  getTheoryResult,
};
