const mongoose = require('mongoose');
const { Schema, model, SchemaTypes } = mongoose;

const testingTheorySchema = new Schema(
  {
    type: { type: String },
    questions: [
      {
        question: {
          type: String,
          required: [true, 'Question is required'],
        },
        answer: {
          type: String,
          required: [true, 'Answer is required'],
        },
        rightAnswer: {
          type: Boolean,
          required: [true, 'RightAnswer is required'],
        },
      },
    ],
    total: { type: Number },
    correctAnswers: { type: Number },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
    email: { type: String },
    name: { type: String },
  },
  { versionKey: false },
);

const testingTheory = model('testingTheory', testingTheorySchema);

module.exports = testingTheory;
