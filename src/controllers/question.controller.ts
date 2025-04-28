import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "../utils/apiResponse";
import { Question } from "../models/question.model";
import { Class } from "../models/class.model";
import { Subject } from "../models/subject.model";

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
      } = req.body;

      console.log("-----------", req.body);
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
      const isClassIdExist = await Class.findById(classId);
      const isSubjectIdExist = await Subject.findById(classId);

      console.log("isClassIdExist", isClassIdExist);
      if (!(isClassIdExist || isSubjectIdExist)) {
        res.status(400).json({
          success: false,
          message: "No such class id or subject id match.",
        });
      }
      const response = await Question.create(req.body);
      console.log(response);
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
    console.log(req.body);
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
    console.log(
      "http://localhost:3000/api/v1/admin/question/680b38086031b9480572dce5"
    );
    try {
      const selectedQuestionId = req.params.id;
      const isSelectedQuestionIdExist = await Subject.findById(
        selectedQuestionId
      );
      if (!isSelectedQuestionIdExist) {
        res
          .status(400)
          .json({ success: false, message: "No such question id exist." });
        return;
      }
      const deletedQuestion = await Question.findByIdAndDelete(
        selectedQuestionId
      );
      console.log("deletedQuestion", deletedQuestion);
      if (deletedQuestion) {
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

const searchQuestion = asyncHandler(async(req:Request,res:Response)=>{
  try {
    const searchString = req.body
    // const searchedResult = await Question.fin
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
})
export { addQuestion, editQuestion, deleteQuestion };
