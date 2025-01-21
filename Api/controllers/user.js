import express  from "express"
import userModel from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import transporter from '../config/nodeMailer.js'
import contactModel from "../models/ContactModel.js"

//register
export const register=async(req,res)=>
{
    const {name,email,phno,password}=req.body
    try
    {
        if(!name||!email||!password||!phno)
        {
            return res.json({success:false,message:"enter the missing details"})
        }
        const existUser= await  userModel.findOne({email})
        if(existUser)
        {
        return res.json({success:false,message:"user already registered"})
        }
         const hashPwd= await bcrypt.hash(password,10)
         const user = await new userModel({name,email,password:hashPwd,phno})
         console.log(user)
         await user.save()
         const mailoptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "welcome to click shop",
            text: `welcome to click shop .Your are account has been created`,
          };
          await transporter.sendMail(mailoptions)

         return res.json({success:true,user,message:"user registred successfully"})
    }
    catch (error)
    {
        return res.json({success:false,message:error})
    }
}
//login
export const login=async(req,res)=>
{
    try
    {
        const {email,password}=req.body
        console.log("login",req.body)

        if (email=='' || password=='')
        {
            return res.json({success:false,message:"user not registred"})
        }
        
        const user= await userModel.findOne({email})
        if(!user)
        {
            return res.json({success:false,message:"incorrect email"})
        }
    
        const validPwd= await bcrypt.compare(password,user.password)
        const token=jwt.sign({userId:user._id},'secret@key',{expiresIn:'1d'})
        if(!validPwd)
        {
            return res.json({success:false,message:"incorrect password"})
        }
        const mailoptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "welcome to click shop",
            text: `welcome to click shop .Your are logged in`,
          };
          await transporter.sendMail(mailoptions)
        return res.json({success:true,message:"user logged in",token})
    }
    catch (error)
    {
        return res.json({success:false,message:error})
    }
}

//all users

export const users= async(req,res)=>
{
    try
    {
            const users= await userModel.find({}).sort({createdAt:-1})
            return res.json({success:false,users})
    }
    catch(error)
    {
        return res.json({success:false,message:"users not find"})
    }
}

//conatct us
export const contact =async(req,res)=>{
    const {name,email,message}=req.body
    const existuser =new contactModel(
        {
         name:name,
         email:email,
         message:message,   
        }
        
    )
    let result = await existuser.save();
    const mailoptions = {
        from: process.env.SENDER_EMAIL,
        to: result.email,
        subject: "welcome to click shop",
        text: `welcome to click shop .Your are form submitted`,
      };
      await transporter.sendMail(mailoptions)
    res.json({'success':true,message:"data posted succesfully"})
}