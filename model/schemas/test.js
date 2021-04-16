const mongoose = require("mongoose");
const { Schema, model, SchemaTypes } = mongoose;

const testsSchema = new Schema(
  {
    type: { type: String },
    questions: [
      {
        question: {
          type: String,
          // required: [true, "Question is required"],
        },
        answer: {
          type: String,
          // required: [true, "Answer is required"],
        },
        rightAnswer: {
          type: Boolean,
          // required: [true, "RightAnswer is required"],
        },
      },
    ],
    total: { type: Number },
    correctAnswers: { type: Number },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
    email: { type: String },
    name: { type: String },
  },
  { versionKey: false }
);

const Tests = model("tests", testsSchema);

module.exports = Tests;
