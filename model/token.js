const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TokenSchema = new Schema({
  tokenId: String,
  userId: String,
});

const Token = model('Token', TokenSchema);

// mongoose.model('Token', TokenSchema);

module.exports = Token;
