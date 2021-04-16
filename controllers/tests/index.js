const path = require('path');
const { parseTests } = require('../../helpers/parseQuestions');
const { httpCode } = require('../../helpers/constants');
const Tests = require('../../model/tests');
const Users = require('../../model/users');
const EmailService = require('../../services/email');

const technicalQuestionsDb = path.join(__dirname, '../../db/technicalQA.json');
const theoryQuestionsDb = path.join(__dirname, '../../db/testingTheory.json');

const getTechResult = async (req, res, next) => {
  try {
    // const userId = req.user.id;
    const token = req.get('Authorization')?.split(' ')[1];
    const user = await Users.findByToken(token);
    const userId = user._id;
    const data = await Tests.findTechResultByUserId(userId);

    return res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      data,
    });
  } catch (e) {
    return res.status(httpCode.NOT_FOUND).json({
      status: 'error',
      code: httpCode.NOT_FOUND,
      message: 'Not Found',
    });
  }
};

const getTheoryResult = async (req, res, next) => {
  try {
    // const userId = req.user.id;
    const token = req.get('Authorization')?.split(' ')[1];
    const user = await Users.findByToken(token);
    const userId = user._id;
    const data = await Tests.findTheoryResultByUserId(userId);

    return res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      data,
    });
  } catch (e) {
    return res.status(httpCode.NOT_FOUND).json({
      status: 'error',
      code: httpCode.NOT_FOUND,
      message: 'Not Found',
    });
  }
};

const removeResult = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const technicalQA = await Tests.deleteResult(userId);

    if (technicalQA) {
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

const createTheoryResult = async (req, res, _) => {
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
          correctAnswer: answer.userAnswer,
          isCorrect: true,
        });
      } else {
        const correctQuestion = dataToCheck.find(
          data => answer.questionId === data.questionId && data.rightAnswer,
        );
        questions.push({
          questionId: answer.questionId,
          question: answer.question,
          answer: answer.userAnswer,
          correctAnswer: correctQuestion.rightAnswer,
          isCorrect: false,
        });
      }
    });

    const correctAnswers = questions.filter(
      question => question.isCorrect === true,
    );
    const newQuestions = questions.map(question => ({
      answer: question.answer,
      correctAnswer: question.correctAnswer,
      question: question.question,
      isCorrect: question.isCorrect,
    }));
    const technicalQA = await Tests.create({
      type: 'theory',
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

const createTechResult = async (req, res, _) => {
  try {
    const { _id, email, name } = req.user;
    const userAnswers = req.body;
    const questions = [];
    const testsList = await parseTests(technicalQuestionsDb);
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
          correctAnswer: answer.userAnswer,
          isCorrect: true,
        });
      } else {
        const correctQuestion = dataToCheck.find(
          data => answer.questionId === data.questionId && data.rightAnswer,
        );
        questions.push({
          questionId: answer.questionId,
          question: answer.question,
          answer: answer.userAnswer,
          correctAnswer: correctQuestion.rightAnswer,
          isCorrect: false,
        });
      }
    });

    const correctAnswers = questions.filter(
      question => question.isCorrect === true,
    );
    const newQuestions = questions.map(question => ({
      answer: question.answer,
      correctAnswer: question.correctAnswer,
      question: question.question,
      isCorrect: question.isCorrect,
    }));
    const technicalQA = await Tests.create({
      type: 'technical',
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

module.exports = {
  createTechResult,
  getTechResult,
  removeResult,
  createTheoryResult,
  getTheoryResult,
};
