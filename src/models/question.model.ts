import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },
    difficultyLevel: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    options: {
      type: [String],
      required: true,
      trim: true,
      validate: [arrayLimit, `Exactly 4 answer choices are required.`],
    },
    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val: String[]) {
  return val.length === 4;
}
export const Question = mongoose.model("Question", questionSchema);
