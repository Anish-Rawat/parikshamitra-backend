import mongoose, { Schema } from "mongoose";

const classSchema = new Schema(
    {
        class:{
            type:String,
            required:true,
            trim:true,
            index:true,
        }
    },
    {
        timestamps:true,
    }
)

export const Class = mongoose.model('Class',classSchema);