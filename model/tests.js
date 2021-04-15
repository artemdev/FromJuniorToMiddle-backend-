const Test = require('./schemas/test');

const create = async body => {
  try {
    const result = await Test.create(body);
    return result;
  } catch (e) {
    console.error(e.message);
  }
};

const findResultByUserId = async userId => {
  try {
    const result = await Test.findOne({
      owner: userId,
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

module.exports = {
  create,
  findResultByUserId,
  deleteResult,
};
