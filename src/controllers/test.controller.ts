import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Test } from "../models/test.model";
import { Question } from "../models/question.model";
import ApiResponse from "../utils/apiResponse";

interface CustomRequest extends Request {
  user: {
    _id: string;
  };
}

const createTest = asyncHandler(async (req: Request, res: Response) => {
  const { testName = '', difficultyLevel, totalQuestions, subjectId, classId } = req.body;
  const customReq = req as CustomRequest;
  const userId = customReq.user._id;

  const testDetails = await Test.create({
    userId,
    testName,
    difficultyLevel,
    totalQuestions,
    subjectId,
    classId,
  });

  res.status(200).json({
    success: true,
    message: "test created successfully",
    testDetails,
  });
});

const getTest = asyncHandler(async (req: Request, res: Response) => {
  const customReq = req as CustomRequest;
  const userId = customReq.user._id;
  const { testId } = req.params;
  if (testId) {
    const testDetails = await Test.findById(testId).populate({
      path: "userId",
      select: "userName",
    });
    if (!testDetails) {
      throw new Error("Test not found");
    }
    const formattedTest = {
      _id: testDetails._id,
      testName: testDetails.testName,
      difficultyLevel: testDetails.difficultyLevel,
      totalQuestions: testDetails.totalQuestions,
      createdBy: testDetails.userId?.userName,
      createdAt: testDetails.createdAt,
      updatedAt: testDetails.updatedAt,
    };
    res.status(200).json({ formattedTest });
  } else {
    const {
      pageNo = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortingOrder = "desc",
    } = req.query;
    const skip = (Number(pageNo || 1) - 1) * Number(limit || 10);
    const sortOrder = sortingOrder === "asc" ? 1 : -1;
    const testDetails = await Test.find({
      userId,
      $or: [
        { testName: { $regex: search || "", $options: "i" } },
        { difficultyLevel: { $regex: search || "", $options: "i" } },
      ],
    })
      .skip(skip)
      .limit(Number(limit))
      .sort({ [sortBy as string]: sortOrder })
      .populate("userId", "userName")
      .lean();

    const formattedTests = testDetails.map((test: any) => ({
      _id: test._id,
      testName: test.testName,
      difficultyLevel: test.difficultyLevel,
      totalQuestions: test.totalQuestions,
      createdBy: test.userId?.userName,
      createdAt: test.createdAt,
      updatedAt: test.updatedAt,
    }));

    const totalTests = await Test.countDocuments({
      userId,
      $or: [
        { testName: { $regex: search || "", $options: "i" } },
        { difficultyLevel: { $regex: search || "", $options: "i" } },
      ],
    });
    const totalPages = Math.ceil(totalTests / Number(limit));

    const response = {
      totalTests,
      totalPages,
      formattedTests,
    };

    res.status(200).json({
      success: true,
      message: "Test fetched successfully",
      tests: response,
    });
  }
});

const deleteTest = asyncHandler(async (req: Request, res: Response) => {
  const { testId } = req.params;
  const test = await Test.findByIdAndDelete(testId);
  if (!test) {
    throw new Error("Test not found");
  }
  res.status(200).json({
    success: true,
    message: "Test deleted successfully",
    test,
  });
});


export { createTest, getTest, deleteTest };
