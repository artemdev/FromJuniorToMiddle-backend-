const Result = require("./schemas/technicalQA");

const addResult = async (body) => {
  try {
    const result = await Result.create(body);
    return result;
  } catch (e) {
    console.error(e.message);
  }
};

const deleteResult = async (userId) => {
  try {
    const result = await Result.remove({
      owner: userId,
    });
    return result;
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  addResult,
  deleteResult,
};
