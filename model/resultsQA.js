const ResultQA = require("./schemas/resultQA");

const addResult = async (body) => {
  try {
    const result = await ResultQA.create(body);
    return result;
  } catch (e) {
    console.error(e.message);
  }
};

const findResultByUserId = async (userId) => {
  try {
    const result = await ResultQA.findOne({
      owner: userId,
    }).populate({
      path: "owner",
      select: "email -_id",
    });
    return result;
  } catch (e) {
    console.error(e.message);
  }
};

const removeResult = async (userId) => {
  try {
    const result = await ResultQA.remove({
      owner: userId,
    });
    return result;
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  addResult,
  findResultByUserId,
  removeResult,
};
