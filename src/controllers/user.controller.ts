import { Request, Response } from "express";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { StatusCodes } from "http-status-codes";
import { Test } from "../models/test.model";

interface CustomRequest extends Request {
  user: {
    _id: string;
  };
}

const getTilesInfoBasedOnRange = async (period: number = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);
  
  const totalUsers = await User.countDocuments({
    createdAt: { $gte: startDate },
  });
  const getAllUsers = await User.find({ createdAt: { $gte: startDate } });
  let totalTestTaken = 0;
  getAllUsers.forEach((user) => {
    if (user.testTaken > 0) {
      totalTestTaken += user.testTaken;
    }
  });
  let averageScore = 0;
  getAllUsers.forEach((user) => {
      averageScore += user.averageScore;
  });
  let testTakenUser = 0;
  getAllUsers.forEach((user) => {
    if (user.testTaken > 0) {
      testTakenUser += 1;
    }
  })
  return {
    totalUsers,
    totalTestTaken,
    averageScore: averageScore / testTakenUser,
  };
};

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  console.log("------------",userId);
  //fetch user from db by id
  if (userId) {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      throw new Error("User not found");
    }
    const response = {
      data: {
        user,
      },
    };
    res.status(StatusCodes.OK).json({ response });
  }
  // fetch all users from db
  else {
    const {
      pageNo = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortingOrder = "desc",
    } = req.query;
    const skip = (Number(pageNo || 1) - 1) * Number(limit || 10);
    const sortOrder = sortingOrder === "asc" ? 1 : -1;
    const users = await User.find({
      $or: [
        { userName: { $regex: search || "", $options: "i" } },
        { email: { $regex: search || "", $options: "i" } },
      ],
    })
      .skip(skip)
      .limit(Number(limit))
      .sort({ [sortBy as string]: sortOrder })
      .select("-password -refreshToken");
    if (!users) {
      throw new Error("Users not found");
    }
    const totalUsers = await User.countDocuments({
      $or: [
        { userName: { $regex: search || "", $options: "i" } },
        { email: { $regex: search || "", $options: "i" } },
      ],
    });
    const totalPages = Math.ceil(totalUsers / Number(limit));
    const response = {
      data: {
        users,
        totalUsers,
        totalPages,
      },
    };
    res.status(StatusCodes.OK).json({ response });
  }
});

const blockUserById = asyncHandler(async (req: Request, res: Response) => {
  // fetch id from the params
  // check if user exist in db
  // if not exist return error
  // update user status from request body
  // send response
  const { userId } = req.params;
  const { status } = req.body;
  if (!userId) {
    throw new Error("User id is required");
  }
  if (!status) {
    throw new Error("Status is required");
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.status === status) {
    throw new Error("User status is already updated");
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");
  res.status(StatusCodes.OK).json({ updatedUser });
});

const getDashboardTilesInfo = asyncHandler(
  async (req: Request, res: Response) => {
    const { range = "day" } = req.query;

    if (range === "day") {
      const data = await getTilesInfoBasedOnRange(1);
      return res.status(StatusCodes.OK).json(data);
    }

    if (range === "week") {
      const data = await getTilesInfoBasedOnRange(7);
      return res.status(StatusCodes.OK).json(data);
    }
    if (range === "month") {
      const data = await getTilesInfoBasedOnRange(30);
      return res.status(StatusCodes.OK).json(data);
    }
    if (range === "year") {
      const data = await getTilesInfoBasedOnRange(365);
      return res.status(StatusCodes.OK).json(data);
    }

    // default case if no valid range
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message:
        "Invalid or missing 'range' parameter. Use 'week', 'month', or 'year'.",
    });
  }
);

const getUserTilesInfo = asyncHandler(async (req: Request, res: Response) => {
  const customReq = req as CustomRequest;
  const userId = customReq.user._id;
  const user = await User.findById(userId).lean().exec();
  if (!user) {
    throw new Error("User not found");
  }
  const testInfo = await Test.find({ userId }).lean().exec();
  if (!testInfo) {
    throw new Error("Test info not found");
  }
  res.status(StatusCodes.OK).json({
    testTaken: user.testTaken,
    averageScore: user.averageScore,
  });
});

export { getAllUsers, blockUserById, getDashboardTilesInfo, getUserTilesInfo };
