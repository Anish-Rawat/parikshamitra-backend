import mongoose, { Schema } from "mongoose";

const testSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testName: {
      type: String,
      required: true,
      trim: true,
    },
    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard", "mixed"],
      required: true,
      trim: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Test = mongoose.model("Test", testSchema);
