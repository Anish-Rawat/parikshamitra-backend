import mongoose, { Schema } from "mongoose";

const subjectSchema = new Schema(
    {
        subjectName:{
            type:String,
            required:true,
            trim:true,
            index:true,
            allowNull: false,
            lowercase: true,
        },
        classId:{
            type:Schema.Types.ObjectId,
            ref:"Class",
            required:false,
            trim:true,
            index:true,
        }
    },
    {
        timestamps:true,
    }
)

// subjectSchema.index({ classId: 1, subjectName: 1 }, { unique: true });
export const Subject = mongoose.model('Subject',subjectSchema)