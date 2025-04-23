import { NextFunction, Request,Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "../utils/apiResponse";
import { Question } from "../models/question.model";

const addQuestion = asyncHandler(async(req:Request,res:Response,_next:NextFunction):Promise<void> => {
    try {
        
        const {className,subjectName,difficultyLevel,question,firstOption,secondOption,thirdOption,fourthOption,correctAnswer} = req.body;

        if(!(className || subjectName || difficultyLevel)){
            res.status(400).json(
                new ApiResponse(400,"Class, subject, and difficulty level are required to proceed.")
            )
            return ;
        }
        if(!(question || firstOption || secondOption || thirdOption || fourthOption || correctAnswer)){
            res.status(400).json(
                new ApiResponse(400,"Please provide the complete question along with all options and the correct answer.")
            )
            return ;
        }

        const response = await Question.create(req.body);
        res.status(200).json(
            new ApiResponse(200,"question added successfully",response)
        )
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

export {addQuestion}
