// middlewares/combined-auth.middleware.ts
import { NextFunction, Request, Response } from "express";
import { Admin } from "../../models/admin.model";
import { User } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  user: jwt.JwtPayload & { role?: string };
}

// Middleware to verify both admin and user tokens
export const verifyAdminOrUserJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const customReq = req as CustomRequest;
  try {
    const token =
      req.cookies.accessToken ?? req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized request" });
    }
    
    const decodedJwt = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as jwt.Secret
    ) as jwt.JwtPayload;

    if (!decodedJwt) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized request" });
    }

    // Try to find user in admin collection first
    let user = await Admin.findById(decodedJwt._id).select(
      "-password -refreshToken"
    );

    if (user) {
      // If user found in Admin collection
      console.log("user found in admin collection ",user)
      customReq.user = { ...decodedJwt, role: "admin" };
      return next();
    }

    // If not admin, check in User collection
    user = await User.findById(decodedJwt._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token or user not found" });
    }
    console.log("user ----",user)

    // If user found in User collection
    customReq.user = { ...decodedJwt, role: "user" };
    next();
  } catch (err) {
    console.error("JWT ERROR", err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid token" });
  }
});

// Middleware that only allows admins
// export const verifyAdminJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   const customReq = req as CustomRequest;
//   try {
//     const token =
//       req.cookies.accessToken ?? req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized request" });
//     }
    
//     const decodedJwt = jwt.verify(
//       token,
//       process.env.ACCESS_TOKEN_SECRET as jwt.Secret
//     ) as jwt.JwtPayload;

//     if (!decodedJwt) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized request" });
//     }

//     // Only check in Admin collection
//     const admin = await Admin.findById(decodedJwt._id).select(
//       "-password -refreshToken"
//     );

//     if (!admin) {
//       return res
//         .status(403)
//         .json({ success: false, message: "Access forbidden: Admin privileges required" });
//     }

//     // Admin found
//     customReq.user = { ...decodedJwt, role: "admin" };
//     next();
//   } catch (err) {
//     console.error("JWT ERROR", err);
//     return res
//       .status(401)
//       .json({ success: false, message: "Invalid token" });
//   }
// });
