import { Subject } from "../models/subject.model";
import ApiResponse from "../utils/apiResponse";
import {asyncHandler} from "../utils/asyncHandler";
import { NextFunction, Request, Response } from 'express';

const getSubjects = asyncHandler(async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        const response = await Subject.find()
        const totalRecords = getSubjects.length;
        res.status(201).json(
            new ApiResponse(200,"subject fetched successfully",{totalRecords,result:response})
        )
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

const addSubject = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { className, subjectName, classId } = req.body;
    
        if (!className || !subjectName) {
            res.status(400).json({
                success: false,
                message: "Class name and Subject are required."
            });
            return;
        }
        
        // Normalize both inputs
        const normalizedClass = className.trim().toLowerCase();
        const normalizedSubject = subjectName.trim().toLowerCase();

        // Check if combination already exists
        const existing = await Subject.findOne({
            className: normalizedClass,
            subjectName: normalizedSubject
        });
        if (existing){
            res.status(409).json({
                success: false,
                message: `Subject '${subjectName}' is already added to class '${className}'.`
            });
            return;
        }

        const response = await Subject.create({ className:normalizedClass, subjectName:normalizedSubject, classId });
    
        res.status(201).json(
            new ApiResponse(200, "Subject added successfully",response)
        );
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error"});
    }
});

const editSubject = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> =>{

    try {
        const selectedSubjectId = req.params.id;
        const {className, subjectName, classId} = req.body;

        // Normalize both inputs
        const normalizedClass = className.trim().toLowerCase();
        const normalizedSubject = subjectName.trim().toLowerCase();

        if (!className || !subjectName) {
            res.status(400).json({
                success: false,
                message: "Class name and Subject are required."
            });
            return; 
        }
    
        const response = await Subject.findByIdAndUpdate(selectedSubjectId,{ className:normalizedClass, subjectName:normalizedSubject, classId },{new:true})
        res.status(201).json(
            new ApiResponse(200,"Subject info updated successfully.",response)
        )
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

const deleteSubject = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const selectedSubjectId = req.params.id;
        await Subject.findByIdAndDelete(selectedSubjectId)
        res.status(201).json(
            new ApiResponse(200,"Subject deleted successfully.")
        )
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

export { addSubject, editSubject, deleteSubject,getSubjects};
