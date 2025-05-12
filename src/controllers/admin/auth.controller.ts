import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { Admin } from "../../models/admin.model";
import bcrypt from "bcrypt";
import { validateEmail } from "../../utils/helper";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/apiError";
import jwt from "jsonwebtoken";

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
    const user = (await Admin.findById(userId)) as any;
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

  const user = await Admin.findOne({ email }).lean().exec();
  if (user) {
    throw new Error("User already exist");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await Admin.create({
    userName,
    email,
    password: hashedPassword,
  });
  const userDetails = await Admin.findById(newUser._id).select(
    "-password -refreshToken"
  );
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

  const user = await Admin.findOne({ email });
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
  const loggedInUser = await Admin.findById(user._id)
    .select("-password")
    .lean();
  loggedInUser.accessToken = accessToken;
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
  await Admin.findOneAndUpdate(
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
  const user = await Admin.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const response = {
    data: {
      user,
    },
  };
  res.status(StatusCodes.OK).json({ response });
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token not found");
    }
    const decodedJwt = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as jwt.Secret
    ) as jwt.JwtPayload;

    if (!decodedJwt) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    const user = await Admin.findById(decodedJwt._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(StatusCodes.OK)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json({
        success: true,
        message: "Access token refreshed successfully",
        data: {
          accessToken,
          refreshToken,
        },
      });
  } catch (error) {
    console.log(error);
  }
});

export { registerUser, loginUser, logoutUser, getUserInfoByEmail, refreshAccessToken };
