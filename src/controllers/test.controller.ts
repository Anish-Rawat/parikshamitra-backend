import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Test } from "../models/test.model";
import { Question } from "../models/question.model";
import { User } from "../models/user.model";

interface CustomRequest extends Request {
  user: {
    _id: string;
  };
}

const createTest = asyncHandler(async (req: Request, res: Response) => {
  const {
    testName = "",
    difficultyLevel,
    totalQuestions,
    subjectId,
    classId,
  } = req.body;
  const customReq = req as CustomRequest;
  const userId = customReq.user._id;

  const testDetails = await Test.create({
    userId,
    testName,
    difficultyLevel,
    totalQuestions,
    subjectId,
    classId,
    marksObtained: 0,
    totalMarks: totalQuestions * 10,
  });
  const response = await Test.findById(testDetails._id).select(
    " -marksObtained"
  )
    res.status(200).json({
    success: true,
    message: "test created successfully",
    response,
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
      .populate("subjectId", "subjectName")
      .populate("classId", "className")
      .lean();
    const formattedTests = testDetails.map((test: any) => ({
      _id: test._id,
      testName: test.testName,
      difficultyLevel: test.difficultyLevel,
      totalQuestions: test.totalQuestions,
      createdBy: test.userId?.userName,
      createdAt: test.createdAt,
      updatedAt: test.updatedAt,
      marksObtained: test.marksObtained ?? 0,
      totalMarks: test.totalMarks ?? 0,
      subjectName: test.subjectId?.subjectName,
      className: test.classId?.className,
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

const submitTest = asyncHandler(async (req: Request, res: Response) => {
  const customReq = req as CustomRequest;
  const userId = customReq.user._id;
  const { testId } = req.query;
  const { answers } = req.body;

  // 1. Fetch the test
  const test = await Test.findById(testId).lean();
  if (!test) {
    return res.status(404).json({ success: false, message: "Test not found" });
  }

  // 2. Create a map from submitted answers
  const submittedMap = new Map<string, string>();
  for (const ans of answers) {
    submittedMap.set(ans.questionId, ans.answer);
  }

  // 3. Fetch all submitted question details in one go
  const questionIds = answers.map((ans: any) => ans.questionId);
  const questions = await Question.find({ _id: { $in: questionIds } }).lean();

  // 4. Compare answers

  let totalScore = 0;
  const evaluatedAnswers = questions.map((q) => {
    const submitted = submittedMap.get(q._id.toString());
    const isCorrect = submitted === q.correctAnswer;
    if (isCorrect) totalScore += 1;

    return {
      questionId: q._id,
      submittedAnswer: submitted,
      correctAnswer: q.correctAnswer,
      isCorrect,
    };
  });


  // Optional: save result to DB for record
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new Error("User not found");
  }

  const newTestTaken = (user.testTaken || 0) + 1;
  const currentAvg = user.averageScore || 0;

  const newAvgScore =
    (currentAvg * (newTestTaken - 1) + totalScore) / newTestTaken;
  await User.updateOne(
    { _id: userId },
    {
      $inc: { testTaken: 1 },
      $set: { averageScore: newAvgScore },
    }
  );

  await Test.updateOne(
    { _id: testId },
    {
      $inc: { marksObtained: totalScore },
    }
  );

  return res.status(200).json({
    success: true,
    message: "Test submitted successfully",
    totalScore,
    evaluatedAnswers, // you can remove this if not needed
  });
});

export { createTest, getTest, deleteTest, submitTest };
