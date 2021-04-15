const TestingTheory = require('./schemas/technicalQA');

const addResult = async body => {
  try {
    const result = await TestingTheory.create(body);
    return result;
  } catch (e) {
    console.error(e.message);
  }
};

const findResultByUserId = async userId => {
  try {
    const result = await TestingTheory.findOne({
      owner: userId,
      type: 'the',
    }).populate({
      path: 'owner',
      select: 'email -_id',
    });
    return result;
  } catch (e) {
    console.error(e.message);
  }
};

const deleteResult = async userId => {
  try {
    const result = await TestingTheory.remove({
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
