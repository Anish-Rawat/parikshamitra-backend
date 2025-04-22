import mongoose, { Schema } from "mongoose";

const subjectSchema = new Schema(
    {
        className:{
            type:String,
            required:true,
            trim:true,
            index:true,
            allowNull: false,
        },
        subjectName:{
            type:String,
            required:true,
            trim:true,
            index:true,
            allowNull: false,
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

subjectSchema.index({ className: 1, subjectName: 1 }, { unique: true });
export const Subject = mongoose.model('Subject',subjectSchema)