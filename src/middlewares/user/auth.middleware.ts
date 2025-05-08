import { NextFunction, Request, Response } from "express";
import { User } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    user: jwt.JwtPayload;
  }
  

export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const customReq = req as CustomRequest;
  try {
    const token =
      req.cookies.accessToken ?? req.headers.authorization?.split(" ")[1];

    if (!token) {
       res
        .status(401)
        .json({ success: false, message: "Unauthorized request" });
    }
    const decodedJwt = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as jwt.Secret
    ) as jwt.JwtPayload;

    if (!decodedJwt) {
       res
        .status(401)
        .json({ success: false, message: "Unauthorized request" });
    }
    const user = await User.findById(decodedJwt._id).select(
      "-password -refreshToken"
    );
    customReq.user = decodedJwt;
    next();
  } catch (err) {
    console.error("JWT ERROR", err);
  }
});
