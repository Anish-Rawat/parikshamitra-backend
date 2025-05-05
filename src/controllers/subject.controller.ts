import { Class } from "../models/class.model";
import { Subject } from "../models/subject.model";
import ApiResponse from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { NextFunction, Request, Response } from "express";

const getSubjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { classId } = req.query;
      const subjectResponse = await Subject.find({
        classId: classId,
      })
        .lean()
        .exec();
      const totalRecords = subjectResponse.length;
      res.status(201).json(
        new ApiResponse(200, "subject fetched successfully", {
          totalRecords,
          result: subjectResponse,
        })
      );
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

const addSubject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { subjectName, classId, totalSubjects = 0 } = req.body;
      console.log("req.body",req.body);
      if (!classId || !subjectName) {
        res.status(400).json({
          success: false,
          message: "Class name and Subject are required.",
        });
        return;
      }

      // Check if combination already exists
      const existing = await Subject.findOne({
        classId: classId,
        subjectName: subjectName,
      });
      if (existing) {
        res.status(409).json({
          success: false,
          message: `Subject is already added to this class.`,
        });
        return;
      }

      const isClassIdExist = await Class.findById(classId);

      if (!isClassIdExist) {
        res
          .status(400)
          .json({ success: false, message: "No such class id exist." });
      }
      const response = await Subject.create({
        subjectName: subjectName,
        classId: classId,
        totalSubjects: totalSubjects,
      });

      // After saving subject
      const updatedSelectedClassInfo = await Class.findByIdAndUpdate(
        classId,
        {
          $inc: { totalSubjects: 1 },
        },
        { new: true }
      );
      res
        .status(201)
        .json(new ApiResponse(200, "Subject added successfully", response));
    } catch (error: unknown) {
      // Duplicate key error from MongoDB
      if (error.code === 11000) {
        res.status(409).json({
          success: false,
          message: "This subject already exists",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      }
    }
  }
);

const editSubject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const selectedSubjectId = req.params.id;
      const { subjectName, classId } = req.body;

      // Normalize both inputs
      const normalizedSubject = subjectName.trim().toLowerCase();

      if (!classId || !subjectName) {
        res.status(400).json({
          success: false,
          message: "Class name and Subject are required.",
        });
        return;
      }
      const isClassIdExist = await Class.findById(classId);
      if (!isClassIdExist) {
        res
          .status(400)
          .json({ success: false, message: "No such class id exist." });
      }
      const response = await Subject.findByIdAndUpdate(
        selectedSubjectId,
        { subjectName: normalizedSubject, classId },
        { new: true }
      );
      res
        .status(201)
        .json(
          new ApiResponse(200, "Subject info updated successfully.", response)
        );
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

const deleteSubject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {classId,subjectId} = req.query;
      const isSelectedSubjectIdExist = await Subject.findById(
        subjectId
      );
      if (!isSelectedSubjectIdExist) {
        res
          .status(400)
          .json({ success: false, message: "No such subject id exist." });
        return;
      }
      const deletedSubject = await Subject.findByIdAndDelete(subjectId);

      if (deletedSubject) {
        // After saving subject
        const updatedSelectedClassInfo = await Class.findByIdAndUpdate(
          classId,
          {
            $inc: { totalSubjects: -1 },
          },
          { new: true }
        );
        res
          .status(201)
          .json(new ApiResponse(200, "Subject deleted successfully."));
      } else {
        res
          .status(400)
          .json({ success: false, message: "Subject Id not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

export { addSubject, editSubject, deleteSubject, getSubjects };
