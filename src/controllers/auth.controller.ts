import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";


const registerUser = asyncHandler(async (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "User registered successfully",
    });
});

export { registerUser };