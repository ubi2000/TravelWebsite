import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import dbConnection from "./config/db";
import authRoute from "./routes/authRoutes"

dotenv.config();

const app: Application = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//DB connection
dbConnection()


//Routes
app.use("/auth",authRoute)

//start
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`App is runing on port ${PORT}`)
})