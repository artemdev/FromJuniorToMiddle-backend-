const mongoose = require("mongoose");
const { Schema, model, SchemaTypes } = mongoose;

const resultTheorySchema = new Schema(
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

const ResultTheory = model("resultTheory", resultTheorySchema);

module.exports = ResultTheory;
