const { httpCode } = require('../../helpers/constants');
const EmailService = require('../../services/email');

const sendEmail = async (_, res) => {
  try {
    const email = 'artem.zimovets@gmail.com';
    const name = 'Artem';
    const emailService = new EmailService(process.env.NODE_ENV);
    const body = {
      score: 90,
      questions: [
        {
          question:
            'What is JS What is JS What is JS What is JS What is JS What is JS What is JS',
          answer: 'What is JS What is JS What is JS What is JS ',
          correctAnswer:
            'Programming languageProgramming language Programming language Programming language',
        },
        {
          item: 'What is JS',
          answer: 'Movie',
          correctAnswer: 'Programming language',
        },
        {
          item: 'What is JS',
          answer: 'Movie',
          correctAnswer: 'Programming language',
        },
      ],

      title: 'Technical test',
      name,
    };

    await emailService.sendEmail(email, body);
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
