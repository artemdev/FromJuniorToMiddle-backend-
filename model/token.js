const mongoose = require('mongoose');
<<<<<<< HEAD

const TokenSchema = new mongoose.Schema({
=======
const { Schema, model } = mongoose;

const TokenSchema = new Schema({
>>>>>>> 8ec4c7bc473e4d152c84be481fcb4e950cedb405
  tokenId: String,
  userId: String,
});

<<<<<<< HEAD
mongoose.model('Token', TokenSchema);
=======
const Token = model('Token', TokenSchema);

// mongoose.model('Token', TokenSchema);

module.exports = Token;
>>>>>>> 8ec4c7bc473e4d152c84be481fcb4e950cedb405
