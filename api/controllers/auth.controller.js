import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

export const signup = async (req, res,next) => {
 
  try {
      const { userName, password, email } = req.body;
      const hashedPassword=bcryptjs.hashSync(password,10)
  
     
  
     const response= await User.create({
          userName,
          email,
          password:hashedPassword
      })
      console.log("user created successfully");
  
      res.status(201).json({ message: "User created successfully" });
  } catch (error) {

    next(error);
    
  }
  
};

export const signin=async(req,res,next)=>{
  const {email,password}=req.body;
  try {
    const user=await User.findOne({email});
    if(!user || user.length===0){
      return next(errorHandler(404,"user not found"));

    }
    console.log(user);
    const validPassword=  bcryptjs.compareSync(password,user.password);
    if(!validPassword) return next(errorHandler(401,"wrong password"));
    console.log(user);

    const token =await jwt.sign({id:user._id},
      process.env.JWT_SECRET
    )
     const respo=await User.findOne({email}).select("-password");
    res.cookie('access_token',token,{httpOnly:true}).status(201).json(respo);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export const google = async (req, res, next) => {
  try {
    const user = await User.find({ email: req.body.email });
    console.log("this is the user", user[0]);

    if (user && user.length >= 1) {
      console.log("User already exists");
      const token = jwt.sign({ id: user[0]._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user[0]._doc;
      res.cookie('access_token', token, { httpOnly: true })
         .status(200)
         .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = await User.create({
        email: req.body.email,
        userName: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        password: hashedPassword,
        avatar: req.body.photo
      });

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      res.cookie('access_token', token, { httpOnly: true })
         .status(200)
         .json(rest);
    }
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
}

export const signOut=(req,res)=>{
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out');
  } catch (error) {
    next(error);
  }
}

