import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "../utils/apiResponse";
import { Question } from "../models/question.model";
import { Class } from "../models/class.model";
import { Subject } from "../models/subject.model";
import mongoose from "mongoose";

const addQuestion = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const {
        classId,
        subjectId,
        difficultyLevel,
        question,
        options,
        correctAnswer,
        totalQuestionsByClassAndSubject = 0,
      } = req.body;

      if (!(classId || subjectId || difficultyLevel)) {
        res
          .status(400)
          .json(
            new ApiResponse(
              400,
              "Class, subject, and difficulty level are required to proceed."
            )
          );
        return;
      }
      if (!(question || options || correctAnswer)) {
        res
          .status(400)
          .json(
            new ApiResponse(
              400,
              "Please provide the complete question along with all 4 options and the correct answer."
            )
          );
        return;
      }

      const allQuestions = await Question.find();
      const duplicate = allQuestions.find(
        (item: any) =>
          item.question.toLowerCase().trim() === question.toLowerCase().trim()
      );

      if (duplicate) {
        res
          .status(400)
          .json({ success: false, message: "This question already exist." });
        return;
      }

      const isClassIdExist = await Class.findById(classId);
      const isSubjectIdExist = await Subject.findById(classId);

      if (!(isClassIdExist || isSubjectIdExist)) {
        res.status(400).json({
          success: false,
          message: "No such class id or subject id match.",
        });
      }
      const response = await Question.create({
        classId: classId.toLowerCase().trim(),
        subjectId: subjectId.toLowerCase().trim(),
        difficultyLevel: difficultyLevel.toLowerCase().trim(),
        question: question,
        options: options,
        correctAnswer: correctAnswer,
        totalQuestionsByClassAndSubject: totalQuestionsByClassAndSubject,
      });
      // After saving subject
      const updatedSelectedSubjectInfo = await Subject.findByIdAndUpdate(
        subjectId,
        {
          $inc: { totalQuestionsByClassAndSubject: 1 },
        },
        { new: true }
      );
      res
        .status(200)
        .json(new ApiResponse(200, "question added successfully", response));
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "ValidationError"
      ) {
        const validationError = error as any;

        const messages = Object.values(validationError.errors).map(
          (val: any) => val.message
        );

        res.status(400).json({
          success: false,
          message: messages.join(". "), // or messages[0] if you want just the first
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      }
    }
  }
);

const editQuestion = asyncHandler(async (req: Request, res: Response) => {
  try {
    const selectedQuestionId = req.params.id;
    const {
      classId,
      subjectId,
      difficultyLevel,
      question,
      options,
      correctAnswer,
    } = req.body;

    if (!(classId || subjectId || difficultyLevel)) {
      res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "Class, subject, and difficulty level are required to proceed."
          )
        );
      return;
    }
    if (!(question || options || correctAnswer)) {
      res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "Please provide the complete question along with all 4 options and the correct answer."
          )
        );
      return;
    }
    const response = await Question.findByIdAndUpdate(
      selectedQuestionId,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json(new ApiResponse(200, "question updated successfully", response));
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      const validationError = error as any;

      const messages = Object.values(validationError.errors).map(
        (val: any) => val.message
      );

      res.status(400).json({
        success: false,
        message: messages.join(". "), // or messages[0] if you want just the first
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
});

const deleteQuestion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { classId, subjectId, questionId } = req.query;
      const isSelectedQuestionIdExist = await Question.findById(questionId);
      if (!isSelectedQuestionIdExist) {
        res
          .status(400)
          .json({ success: false, message: "No such question id exist." });
        return;
      }
      const deletedQuestion = await Question.findByIdAndDelete(questionId);
      if (deletedQuestion) {
        // After deleting subject
        const updatedSelectedSubjectInfo = await Subject.findByIdAndUpdate(
          subjectId,
          {
            $inc: { totalQuestionsByClassAndSubject: -1 },
          },
          { new: true }
        );
        res
          .status(201)
          .json(
            new ApiResponse(
              200,
              "Question deleted successfully.",
              deleteQuestion
            )
          );
      } else {
        res
          .status(400)
          .json({ success: false, message: "Question Id not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

const searchQuestion = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { searchString, page = 1, limit = 10 } = req.query;
    if (!searchString) {
      res
        .status(400)
        .json({ success: false, message: "Search string is required." });
    }
    const howManyQuestionToSkip = (Number(page) - 1) * Number(limit);
    const searchedResult = await Question.find({
      question: { $regex: searchString, $options: "i" },
    })
      .skip(howManyQuestionToSkip)
      .limit(Number(limit));

    res
      .status(200)
      .json(
        new ApiResponse(200, "question searched successfully", searchedResult)
      );
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      const validationError = error as any;

      const messages = Object.values(validationError.errors).map(
        (val: any) => val.message
      );

      res.status(400).json({
        success: false,
        message: messages.join(". "), // or messages[0] if you want just the first
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
});

const filterQuestion = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { subjectId, classId, difficultyLevel } = req.body;
    const { page = 1, limit = 10 } = req.query;
    if (!(subjectId || classId || difficultyLevel)) {
      res.status(400).json({
        success: false,
        message:
          "Please select either class, subject or difficulty level to filter the data.",
      });
    }
    const howManyQuestionToSkip = (Number(page) - 1) * Number(limit);
    const filteredQuestion = await Question.find({
      classId: classId.toLowerCase().trim(),
      subjectId: subjectId.toLowerCase().trim(),
      difficultyLevel: difficultyLevel.toLowerCase().trim(),
    })
      .skip(howManyQuestionToSkip)
      .limit(Number(limit));

    res
      .status(200)
      .json(
        new ApiResponse(200, "Data filtered successfully", filteredQuestion)
      );
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      const validationError = error as any;

      const messages = Object.values(validationError.errors).map(
        (val: any) => val.message
      );

      res.status(400).json({
        success: false,
        message: messages.join(". "), // or messages[0] if you want just the first
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
});

const getQuestions = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const {
        classId,
        subjectId,
        difficultyLevel = "easy",
        totalQuestions = 10,
      } = req.query;
      if (classId === undefined || subjectId === undefined) {
        res
          .status(400)
          .json({ success: false, message: "Class and subject are required." });
        return;
      }

      const isClassIdExist = await Class.findOne({ _id: classId })
        .lean()
        .exec();
      if (!isClassIdExist) {
        res
          .status(400)
          .json({ success: false, message: "No such class id exist." });
        return;
      }
      const subject = await Subject.findOne({ _id: subjectId });
      if (!subject) {
        res
          .status(400)
          .json({ success: false, message: "No such subject id exist." });
        return;
      }
      const questions = await Question.aggregate([
        {
          $match: {
            classId: new mongoose.Types.ObjectId(classId as string),
            subjectId: new mongoose.Types.ObjectId(subjectId as string),
            difficultyLevel: difficultyLevel,
          },
        },
        { $sample: { size: Number(totalQuestions) } },
        {
          $project: {
            correctAnswer: 0,
            __v: 0,
          },
        },
      ]);
      res
        .status(200)
        .json(new ApiResponse(200, "Questions fetched", questions));
    } catch (error) {
      console.log(error);
    }
  }
);

export {
  addQuestion,
  editQuestion,
  deleteQuestion,
  searchQuestion,
  filterQuestion,
  getQuestions,
};
