import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "../utils/apiResponse";
import { Class } from "../models/class.model";
import { Subject } from "../models/subject.model";

const addClass = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { className, category } = req.body;
      if (!(className.trim() && category.trim())) {
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

      const normalizedClass = className?.toLowerCase();
      const normalizedCategory = category?.toLowerCase();
      const response = await Class.create({
        className: normalizedClass,
        category: normalizedCategory,
      });
      res
        .status(200)
        .json(new ApiResponse(200, "class added successfully", response));
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error });
    }
  }
);

const deleteClass = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { classId } = req.query;
      if (!classId) {
        res.status(400).json(new ApiResponse(400, "Class is not selected to delete."));
        return;
      }
      
      const isSelectedClassIdExist = await Class.findById(classId);
      if(!isSelectedClassIdExist){
        res.status(400).json(new ApiResponse(400, "No such class exist."));
        return;
      }
      const response = await Class.findByIdAndDelete(classId)
      res
        .status(200)
        .json(new ApiResponse(200, "class deleted successfully", response));
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error });
    }
  }
);

const editClass = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { classId } = req.query;
      const {category,className} = req.body;
      console.log("className",className,"category",category)
      if (!classId) {
        res.status(400).json(new ApiResponse(400, "Class is not selected to edit."));
        return;
      }
      
      const isSelectedClassIdExist = await Class.findById(classId);
      if(!isSelectedClassIdExist){
        res.status(400).json(new ApiResponse(400, "No such class exist."));
        return;
      }
      const normalizedClass = className?.toLowerCase();
      const normalizedCategory = category?.toLowerCase();
      console.log("normalized classs",normalizedCategory,normalizedClass)
      const response = await Class.findByIdAndUpdate(classId,{className:normalizedClass,category:normalizedCategory},{new:true})
      console.log("response",response)
      res
        .status(200)
        .json(new ApiResponse(200, "class edit successfully", response));
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error });
    }
  }
);

const getClassesAndStreams = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const classes = await Class.find().lean().exec();

      // Fetch question counts grouped by classId
      // const subjectCounts = await Subject.aggregate([
      //   {
      //     $group: {
      //       _id: "$classId",
      //       totalQuestions: { $sum: 1 },
      //     },
      //   },
      // ]);

      // Add question counts to classes
      // (classes as any).forEach((classItem: any) => {
      //   const subjectCount = subjectCounts.find(
      //     (item) => item._id.toString() === classItem._id.toString()
      //   );
      //   classItem.totalQuestions = subjectCount?.totalQuestions ?? 0;
      // });

      res.status(200).json(new ApiResponse(200, "Classes fetched", classes));
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error });
    }
  }
);

export { addClass, getClassesAndStreams, deleteClass, editClass};
