const fs = require('fs').promises;

const listRandomTests = async path => {
  try {
    const data = await fs.readFile(path);
    const parsedData = JSON.parse(data)
      .sort(function () {
        return 0.5 - Math.random();
      })
      .slice(0, 12);
    // вытянуть правильные
    // rightAnswer
    const final = parsedData.map(function (question) {
      delete question.rightAnswer;
      return question;
    });
    return final;
  } catch (error) {
    console.log(error);
  }
};

const parseTests = async path => {
  try {
    const data = await fs.readFile(path);
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listRandomTests,
  parseTests,
};
