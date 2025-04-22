import mongoose from "mongoose";
import { Db_Name } from "../constants";

const connectDb = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_CONNECTION_URI}/${Db_Name}`)
        console.log("DB connected successfully....");
    } catch (error) {
        console.log("DB not connected....",error);
        process.exit(1);
    }
}

export default connectDb