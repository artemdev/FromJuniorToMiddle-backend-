const sgMail = require('@sendgrid/mail');
const Mailgen = require('mailgen');
const config = require('../config/email.json');
const FROM_EMAIL = 'valentynachudik@gmail.com';
// const FROM_EMAIL = 'artwayprojects@gmail.com';
require('dotenv').config();
class EmailService {
  #sender = sgMail;
  #GenerateTemplate = Mailgen;

  constructor(env) {
    switch (env) {
      case 'development':
        this.link = config.dev;
        break;
      case 'stage':
        this.link = config.stage;
        break;
      case 'production':
        this.link = config.prod;
        break;
      default:
        this.link = config.dev;
        break;
    }
  }

  #createReport(body, subject) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'salted',
      product: {
        name: subject,
        link: this.link,
      },
    });

    const template = {
      body: {
        name: body.name,
        intro: 'Your   test results',
        table: body.questions.map(item => {
          return {
            title: item.question,
            data: [
              {
                answer: item.answer,
                Correct: (item.isCorrect && 'Yes') || 'No',
                correctAnswer: item.correctAnswer,
              },
            ],
          };
        }),
      },

      outro: 'Thank you for your answers!',
    };
    return mailGenerator.generate(template);
  }

  #createJobOffer(name, score, subject) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'salted',
      product: {
        name: subject,
        link: this.link,
      },
    });

    const template = {
      body: {
        name: name,
        intro: 'Congratulations! You have passed the "Junior to Middle" test!',
        table: {
          title:
            'Your Middle FrontEnd Developer offer with the salary of 1500$ is ready',
          data: [
            {
              Intruction: 'Please reply to this email to continue',
            },
          ],
        },
      },

      outro: 'See you soon, Mate!',
    };
    return mailGenerator.generate(template);
  }

  async sendEmail(email, body, type = 'theory') {
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    //  SEND REPORT
    const score = Math.round((100 / body.total) * body.correctAnswers);
    const subject = `Your ${type} test score is ${score} %!`;
    const jobOfferSubject = 'Middle Developer Job Offer';
    const reportBody = this.#createReport(body, subject);
    const jobOfferBody = this.#createJobOffer(
      body.name,
      score,
      jobOfferSubject,
    );
    // SEND REPORT
    const report = {
      to: email,
      // from: 'artwayprojects@gmail.com',
      from: FROM_EMAIL,
      subject: subject,
      html: reportBody,
    };
    await this.#sender.send(report);

    // SEND JOB OFFER
    const jobOffer = {
      to: email,
      // from: 'artwayprojects@gmail.com',
      from: FROM_EMAIL,
      subject: jobOfferSubject,
      html: jobOfferBody,
    };
    await this.#sender.send(jobOffer);

    require('fs').writeFileSync('./public/email.html', reportBody, 'utf8');
    require('fs').writeFileSync('./public/offer.html', jobOfferBody, 'utf8');
  }
}

module.exports = EmailService;
