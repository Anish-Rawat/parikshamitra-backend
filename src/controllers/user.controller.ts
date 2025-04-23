import { Request, Response } from "express";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { StatusCodes } from "http-status-codes";

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
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
        totalPages
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

export { getAllUsers, blockUserById };
