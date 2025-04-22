import mongoose, { Schema } from "mongoose";

const subjectSchema = new Schema(
    {
        className:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        subjectName:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        classId:{
            type:Schema.Types.ObjectId,
            ref:"Class",
            required:false,
        }
    },
    {
        timestamps:true,
    }
)

export const Subject = mongoose.model('Subject',subjectSchema)