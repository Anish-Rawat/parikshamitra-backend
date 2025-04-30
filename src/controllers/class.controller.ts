import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "../utils/apiResponse";
import { Class } from "../models/class.model";

const addClass = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { className ,category} = req.body;
      if (!(className.trim() || category.trim())) {
        res.status(400).json(new ApiResponse(400, "Class name is required."));
        return;
      }
      const classes = await Class.find();
      const duplicate = classes.find(
        (item) =>
          item.className.toLowerCase().trim() === className.toLowerCase().trim()
      );

      if (duplicate) {
        res
          .status(400)
          .json({ success: false, message: "Class Name already exists" });
        return;
      }

      const normalizedClass = className.toLowerCase();
      const normalizedCategory = category.toLowerCase();
      const response = await Class.create({ className: normalizedClass ,category:normalizedCategory});
      res
        .status(200)
        .json(new ApiResponse(200, "class added successfully", response));
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

export { addClass };
