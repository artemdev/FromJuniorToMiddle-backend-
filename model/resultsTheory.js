const ResultTheory = require("./schemas/resultTheory");

const addResult = async (body) => {
  try {
    const result = await ResultTheory.create(body);
    return result;
  } catch (e) {
    console.error(e.message);
  }
};

const findResultByUserId = async (userId) => {
  try {
    const result = await ResultTheory.findOne({
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
    const result = await ResultTheory.remove({
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
