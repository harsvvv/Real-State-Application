import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './router/user.router.js';
import authRouter from './router/auth.router.js';
import cookieParser from 'cookie-parser';
import listingRouter from './router/listing.router.js';


dotenv.config()

const app =express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to mongodb")
    
    }).catch((err)=>{
        console.log('error occured data base not connected',error);
})


app.listen(3000,()=>{
    console.log("server running on port 3000!");
})

app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/listing',listingRouter);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message|| "internal server error";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})

export {app};