const Test = require('./schemas/test');

const create = async body => {
  try {
    const result = await Test.create(body);
    return result;
  } catch (e) {
    console.error(e.message);
  }
};

const findTechResultByUserId = async userId => {
  try {
    const result = await Test.findOne({
      owner: userId,
      type: 'technicalQA',
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
    const result = await Test.remove({
      owner: userId,
    });
    return result;
  } catch (e) {
    console.error(e.message);
  }
};

const findTheoryResultByUserId = async userId => {
  try {
    const result = await Test.findOne({
      owner: userId,
      type: 'testingTheory',
    }).populate({
      path: 'owner',
      select: 'email -_id',
    });
    return result;
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  create,
  findTheoryResultByUserId,
  findTechResultByUserId,
  deleteResult,
};
