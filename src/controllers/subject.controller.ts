import { Class } from "../models/class.model";
import { Subject } from "../models/subject.model";
import ApiResponse from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { NextFunction, Request, Response } from "express";

// const getSubjects = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const { classId } = req.query;
//       let subjectResponse;
//       if (classId) {
//         subjectResponse = await Subject.find({
//           classId: classId,
//         })
//           .populate("classId", "className")
//           .lean()
//           .exec();
//       } else {
//         subjectResponse = await Subject.find()
//           .populate("classId", "className")
//           .lean()
//           .exec();
//       }
//       const totalRecords = subjectResponse.length;
//       console.log(subjectResponse);
//       const formattedSubjectResponse = subjectResponse.map((sub) => ({
//         _id: sub._id,
//         subjectName: sub.subjectName,
//         classId: sub.classId?._id || null,
//         className: sub.classId?.className || "",
//         totalQuestionsByClassAndSubject: sub.totalQuestionsByClassAndSubject,
//         createdAt: sub.createdAt,
//         updatedAt: sub.updatedAt,
//       }));
//       res.status(201).json(
//         new ApiResponse(200, "subject fetched successfully", {
//           totalRecords,
//           result: formattedSubjectResponse,
//         })
//       );
//     } catch (error) {
//       res
//         .status(500)
//         .json({ success: false, message: "Internal Server Error" });
//     }
//   }
// );

const addSubject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { subjectName, classId, totalSubjects = 0 } = req.body;
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
      let formattedAddedSubject;
      if (response) {
        formattedAddedSubject = {
          ...response.toObject(),
          className: isClassIdExist?.className,
        };
      }
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
        .json(
          new ApiResponse(
            200,
            "Subject added successfully",
            formattedAddedSubject
          )
        );
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
      const { subjectId } = req.query;
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
        subjectId,
        { subjectName: normalizedSubject, classId },
        { new: true }
      );
      let formattedEditSubject;
      if (response) {
        formattedEditSubject = {
          ...response.toObject(),
          className: isClassIdExist?.className,
        };
      }
      res
        .status(201)
        .json(
          new ApiResponse(
            200,
            "Subject info updated successfully.",
            formattedEditSubject
          )
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
      const { classId, subjectId } = req.query;
      const isSelectedSubjectIdExist = await Subject.findById(subjectId);
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

const getSubjects = asyncHandler(
  async ( req: Request,res: Response, next: NextFunction): Promise<void> => {
    try {
      const {classId="",page=1,limit=10}=req.query;
      const filters: Record<string, any> = {};
      if (classId) filters.classId = (classId as string).toLowerCase().trim();
      const howManySubjectsToSkip = (Number(page)-1)*Number(limit);
      const filteredSubjectByClassId = await Subject.find(filters).populate("classId","className").skip(howManySubjectsToSkip).limit(Number(limit)).lean().exec()
      const totalRecords = (await Subject.find(filters).populate("classId","className").lean().exec()).length
      const formattedFilteredSubjectsByClassId = await filteredSubjectByClassId.map((sub) => ({
        _id: sub._id,
        subjectName: sub.subjectName,
        classId: sub.classId?._id || null,
        className: sub.classId?.className || "",
        totalQuestionsByClassAndSubject: sub.totalQuestionsByClassAndSubject,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
      }));
      res
      .status(200)
      .json(
        new ApiResponse(200, "Data filtered successfully", {result : formattedFilteredSubjectsByClassId,totalRecords:totalRecords})
      );
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "ValidationError"
      ) {
        const validationError = error as any;
  
        const messages = Object.values(validationError.errors).map(
          (val: any) => val.message
        );
  
        res.status(400).json({
          success: false,
          message: messages.join(". "), // or messages[0] if you want just the first
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
export { addSubject, editSubject, deleteSubject, getSubjects};
