const sgMail = require('@sendgrid/mail');
const Mailgen = require('mailgen');
const config = require('../config/email.json');
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

  #createTemplate(data) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'neopolitan',
      product: {
        name: data.title,
        link: this.link,
      },
    });
    const template = {
      body: {
        name: data.name,
        intro: `Your score is ${data.score} %`,
        table: {
          data: data.questions,
        },
        outro: 'Thank you for your answers!',
      },
    };
    return mailGenerator.generate(template);
  }

  async sendEmail(email, body) {
    const emailBody = this.#createTemplate(body);
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: 'artwayprojects@gmail.com',
      subject: `Your score is ${body.score} %!`,
      html: emailBody,
    };
    await this.#sender.send(msg);
    require('fs').writeFileSync('./public/email.html', emailBody, 'utf8');
  }
}

module.exports = EmailService;
