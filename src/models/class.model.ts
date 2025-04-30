import mongoose, { Schema } from "mongoose";

const classSchema = new Schema(
    {
        className:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        category:{
            type:String,
            required:true,
            trim:true,
            index:true,
            enum: ["class", "stream"]
        }
    },
    {
        timestamps:true,
    }
)

export const Class = mongoose.model('Class',classSchema);