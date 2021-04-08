const mongoose = require("mongoose");
const { Schema, model, SchemaTypes } = mongoose;

const resultQASchema = new Schema(
  {
    userRA: [
      {
        answerId: {
          type: Number,
          unique: true,
        },
        answer: {
          type: String,
        },
      },
    ],
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

const ResultQA = model("resultQA", resultQASchema);

module.exports = ResultQA;
