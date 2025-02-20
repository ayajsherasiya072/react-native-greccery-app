import mongoose from "mongoose";

export const connectDB=async(url)=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("db connected");
    }
    catch(error){
        console.log("database connection error",error);
        
    }
}

