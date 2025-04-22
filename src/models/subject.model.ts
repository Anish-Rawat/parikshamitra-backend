import { Schema } from "mongoose";

const subjectSchema = new Schema(
    {
        class:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        subject:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        classId:{
            
        }
    },
    {
        timestamps:true,
    }
)