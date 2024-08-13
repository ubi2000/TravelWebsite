import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const MONGO_URI =process.env.MONGO_URI || ""


const dbConnection = async ( )=>{
try {
    
    await mongoose.connect(MONGO_URI
    //     ,{
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // }
)
    console.log("Connected to Database Successfully")
} catch (error) {
    console.log("connection failed",error)
    process.exit(1)
}
}
export default dbConnection