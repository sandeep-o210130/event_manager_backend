const express = require("express");
const User = require("../models/usermodel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Module = require("module");
const { route } = require("./eventRoutes.js");

const router = express.Router();

router.post("/register",async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        let det = await User.findOne({email});
        console.log(`Already Exists Data:-${det}`);
        if(det){
            res.status(500).json({message:"already user exists"})
            return ;
        }
        const hashedpassword = await bcrypt.hash(password,10);
        const newuser = new User({name,email,password:hashedpassword});
        await newuser.save();
        console.log(newuser);
        console.log("user registered successfully");
        res.status(201).json({message:"user registered successfully"});
    }
    catch(error){
        console.log("user not registered successfully");
        res.status(500).json({error:"user not registered successfully"});
    }
})

router.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    console.log(user);
    if(!user){
        res.status(500).json({error:"In correct details"})
        return console.log("user not found");
    }

    if(!(await bcrypt.compare(password,user.password))){
        res.status(500).json({error:"In correct details"})
            return console.log("NOT FOUND LOGIN DETAILS");
    }

    const token = jwt.sign({id:user._id},"secretkey",{expiresIn:"1d"});
    console.log(token);
    res.status(201).json({message:"correct details",token});
})
module.exports = router;