const path = require('path');
const TestsList = require('../../helpers/parseQuestions');
const { httpCode } = require('../../helpers/constants');
const Testing = require('../../model/testingTheory');
const EmailService = require('../../services/email');

const testingTheoryDb = path.join(__dirname, '../../db/testingTheory.json');

const createResultTheory = async (req, res, next) => {
  try {
    const { _id, email, name } = req.user;
    const userAnswers = req.body;
    const questions = [];
    const testsList = await TestsList.listAllTests(testingTheoryDb);
    const dataToCheck = testsList.map(
      ({ questionId, question, rightAnswer }) => ({
        questionId,
        question,
        rightAnswer,
      }),
    );

    userAnswers.forEach(answer => {
      if (
        dataToCheck.find(
          data =>
            answer.questionId === data.questionId &&
            answer.userAnswer === data.rightAnswer,
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

    const correctAnswers = questions.filter(el => el.rightAnswer === true);
    const newQuestions = questions.map(question => ({
      answer: question.answer,
      rightAnswer: question.rightAnswer,
      question: question.question,
    }));
    const technicalQA = await Testing.addResult({
      type: 'testingTheory',
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
    const emailService = new EmailService(process.env.NODE_ENV);
    await emailService.sendEmail(email, body, technicalQA.type);

    return res.status(httpCode.CREATED).json({
      status: 'success',
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

// const createResultTheory = async (req, res, next) => {
//   try {
//     const { _id, email, name } = req.user;
//     const userAnswers = req.body;
//     const questions = [];
//     const testsList = await TestsList.listAllTests(testingTheoryDb);
//     const dataToCheck = testsList.map(
//       ({ questionId, question, rightAnswer }) => ({
//         questionId,
//         question,
//         rightAnswer,
//       })
//     );

//     userAnswers.forEach((answer) => {
//       if (
//         dataToCheck.find(
//           (data) =>
//             answer.questionId === data.questionId &&
//             answer.userAnswer === data.rightAnswer
//         )
//       ) {
//         questions.push({
//           questionId: answer.questionId,
//           question: answer.question,
//           answer: answer.userAnswer,
//           rightAnswer: true,
//         });
//       } else {
//         questions.push({
//           questionId: answer.questionId,
//           question: answer.question,
//           answer: answer.userAnswer,
//           rightAnswer: false,
//         });
//       }
//     });

//     const correctAnswers = questions.filter((el) => el.rightAnswer === true);

//     const testingTheory = await Testing.addResult({
//       type: "testingTheory",
//       questions,
//       total: questions.length,
//       correctAnswers: correctAnswers.length,
//       owner: _id,
//       email,
//       name,
//     });
//     if (testingTheory) {
//       const emailService = new EmailService(process.env.NODE_ENV);
//       await emailService.sendEmail(email, testingTheory);

//       return res.status(httpCode.CREATED).json({
//         status: "success",
//         code: httpCode.CREATED,
//         data: {
//           type: testingTheory.type,
//           questions: testingTheory.questions,
//           total: testingTheory.total,
//           correctAnswers: testingTheory.correctAnswers,
//           owner: testingTheory.owner,
//           mail: testingTheory.email,
//           name: testingTheory.name,
//         },
//       });
//     } else {
//       return res.status(httpCode.BAD_REQUEST).json({
//         status: "error",
//         code: httpCode.BAD_REQUEST,
//         message: "Not Found",
//       });
//     }
//   } catch (e) {
//     next(e);
//   }
// };

const getResultTheory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resultTheory = await Testing.findResultByUserId(userId);

    if (resultTheory) {
      return res.status(httpCode.OK).json({
        status: 'success',
        code: httpCode.OK,
        data: {
          resultTheory,
        },
      });
    } else {
      return res.status(httpCode.NOT_FOUND).json({
        status: 'error',
        code: httpCode.NOT_FOUND,
        message: 'Not Found',
      });
    }
  } catch (e) {
    next(e);
  }
};

const removeResultTheory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const testingTheory = await Testing.deleteResult(userId);

    if (testingTheory) {
      return res.status(httpCode.OK).json({
        status: 'success',
        code: httpCode.OK,
        message: 'Results deleted',
      });
    } else {
      return res.status(httpCode.NOT_FOUND).json({
        status: 'error',
        code: httpCode.NOT_FOUND,
        message: 'Not Found',
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createResultTheory,
  getResultTheory,
  removeResultTheory,
};
