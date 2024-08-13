import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import dbConnection from "./config/db";


dotenv.config();

const app: Application = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//DB connection
dbConnection()


//Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Tour and Travel App");
});

//start
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`App is runing on port ${PORT}`)
})