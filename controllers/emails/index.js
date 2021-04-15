const { httpCode } = require('../../helpers/constants');
const EmailService = require('../../services/email');

const sendEmail = async (_, res) => {
  try {
    const email = 'artem.zimovets@gmail.com';

    const emailService = new EmailService(process.env.NODE_ENV);

    // const title = type ?? "Technical test" || "Theory test"
    // type = "tech"
    const name = 'Artem';
    const type = 'theory';
    const questions = [
      {
        question:
          'What is JS What is JS What is JS What is JS What is JS What is JS What is JS',
        answer: 'What is JS What is JS What is JS What is JS ',
        rightAnswer:
          'Programming languageProgramming language Programming language Programming language',
      },
      {
        question:
          'What is JS What is JS What is JS What is JS What is JS What is JS What is JS',
        answer: 'What is JS What is JS What is JS What is JS ',
        rightAnswer:
          'Programming languageProgramming language Programming language Programming language',
      },
      {
        question:
          'What is JS What is JS What is JS What is JS What is JS What is JS What is JS',
        answer: 'What is JS What is JS What is JS What is JS ',
        rightAnswer:
          'Programming languageProgramming language Programming language Programming language',
      },
    ];
    const body = {
      // score: 90,
      total: 10,
      questions,
      name,
      correctAnswers: 9,
    };

    await emailService.sendEmail(email, body, type);
    return res.status(httpCode.OK).json({
      message: 'Email has been sent!',
    });
  } catch (error) {
    return res.status(httpCode.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
    });
  }
};

module.exports = { sendEmail };
