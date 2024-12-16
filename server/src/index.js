import express from "express";
import dbConnection from "./database/connection.js";
import userRouter from "./route/userRoutes.js";
import eventRouter from './route/eventRoutes.js'
import dotevn from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path"
import { fileURLToPath } from "url";

dotevn.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', (req, res, next) => {
    console.log('Static file request:', req.path);
    next();
  });
  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dbConnection();

//console.log(process.env.JWT_SECRET);


app.use('/api/users', userRouter);
app.use('/api/event', eventRouter);

const port = 3001;
app.listen(port, ()=>{
    console.log(`Running on port ${port}`);
    
})