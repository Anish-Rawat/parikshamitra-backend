import { Subject } from "../models/subject.model";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { NextFunction, Request, Response } from 'express';

const addSubject = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { className, subjectName, classId } = req.body;

    if (!className || !subjectName) {
        res.status(400).json({
            success: false,
            message: "Class name and Subject are required."
        });
        return;
    }

    const subject = await Subject.create({ className, subjectName, classId });

    res.status(201).json(
        new ApiResponse(200, "Subject added successfully", subject)
    );
});

const editSubject = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> =>{

    const selectedSubjectId = req.params.id;
    const {className, subjectName, classId} = req.body;
    if (!className || !subjectName) {
        res.status(400).json({
            success: false,
            message: "Class name and Subject are required."
        });
        return; // make sure to return here so execution stops
    }

    const updatedSubjectInfo = await Subject.findByIdAndUpdate(selectedSubjectId,req.body,{new:true})
    res.status(201).json(
        new ApiResponse(200,"Subject info updated successfully.",updatedSubjectInfo)
    )
})
export { addSubject, editSubject};
