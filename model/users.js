const User = require('./schemas/user.js');

const findByEmail = async email => {
  return await User.findOne({ email: email });
};
const findByToken = async token => {
  return await User.findOne({ token });
};

const findById = async id => {
  return await User.findOne({ _id: id });
};

const create = async ({ email, password }) => {
  const name = email.split('@')[0].split('.')[0];
  return await User.create({
    name,
    email,
    password,
  });
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token: token });
};

const updateAvatar = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatar: avatar });
};

module.exports = {
  findByEmail,
  findByToken,
  findById,
  create,
  updateToken,
  updateAvatar,
};
