import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import { validateEmail } from "../utils/helper";
import { StatusCodes } from "http-status-codes";

const checkPasswordMatch = async (plainText: string, hashed: string) => {
  try {
    return await bcrypt.compare(plainText, hashed);
  } catch (err) {
    console.error("Error comparing passwords", err);
    return false;
  }
};

const generateAccessAndRefreshToken = async (userId: Object) => {
  try {
    const user = (await User.findById(userId)) as any;
    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Error generating access and refresh tokens");
  }
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // 1. fetch userName, email, password from req.body
  // 2. sanitize userName, email, password
  // 3. check if email exist in db
  // 4. if exist return error
  // 5. hash password
  // 6. create user
  // 7. send response

  const { userName, email, password } = req.body;
  if ([userName.trim(), email.trim(), password.trim()].includes("")) {
    throw new Error("please enter all fields");
  }

  const isValidEmail = validateEmail(email);
  if (!isValidEmail) {
    throw new Error("Please enter valid email");
  }

  const user = await User.findOne({ email }).lean().exec();
  if (user) {
    throw new Error("User already exist");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    userName,
    email,
    password: hashedPassword,
  });
  const userDetails = await User.findById(newUser._id).select("-password -refreshToken");
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: userDetails,
  });
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  // 1. fetch email, password from req.body
  // 2. sanitize email, password
  // 3. check if user exist in db
  // 4. if not exist return error
  // 5. check if password match
  // 6. if not match return error
  // 7. send response

  const { email, password } = req.body;

  if ([email.trim(), password.trim()].includes("")) {
    throw new Error("please enter all fields");
  }

  const isValidEmail = validateEmail(email);
  if (!isValidEmail) {
    throw new Error("Please enter valid email");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await checkPasswordMatch(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Password does not match");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
  .status(200)
  .cookie("refreshToken", refreshToken, options)
  .cookie("accessToken", accessToken, options)
  .json({
    success: true,
    message: "User logged in successfully",
    data: loggedInUser,
  });
});

const logoutUser = asyncHandler(async (req: any, res: any) => {
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { refreshToken: "" },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .status(200)
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

const getUserInfoByEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.params;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const response = {
    data: {
      user,
    },
  };
  res.status(StatusCodes.OK).json({ response });
})

export { registerUser, loginUser, logoutUser, getUserInfoByEmail };
