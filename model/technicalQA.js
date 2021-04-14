const TechnicalQA = require("./schemas/technicalQA");

const addResult = async (body) => {
  try {
    const result = await TechnicalQA.create(body);
    return result;
  } catch (e) {
    console.error(e.message);
  }
};

const findResultByUserId = async (userId) => {
  try {
    const result = await TechnicalQA.findOne({
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

const deleteResult = async (userId) => {
  try {
    const result = await TechnicalQA.remove({
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
  deleteResult,
};
