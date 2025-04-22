import { Subject } from "../models/subject.model";
import ApiResponse from "../utils/apiResponse";
import {asyncHandler} from "../utils/asyncHandler";
import { Request, Response } from 'express';

const addSubject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { className, subjectName, classId } = req.body;

    if (!className || !subjectName) {
        res.status(400).json({
            success: false,
            message: "Class name and Subject are required."
        });
        return; // make sure to return here so execution stops
    }

    const subject = await Subject.create({ className, subjectName, classId });

    res.status(201).json(
        new ApiResponse(201, "Subject added successfully", subject)
    );
});

export { addSubject };
