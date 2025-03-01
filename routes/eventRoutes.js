const express = require("express");
const router = express.Router();
const Event = require("../models/eventmodel");
const User = require("../models/usermodel");
const sendEmail = require("../emailService");

router.get("/",async (req,res)=>{
    try{
        const events = await Event.find({});
        console.log(events);
        res.status(200).json(events);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"error bro"});
    }
})

router.get("/dashboard",async (req,res)=>{
    try{
        let userId = req.headers["auth"];
        console.log(userId);
        const events = await Event.find({user:userId});
        console.log(events);
        res.status(200).json(events);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"error bro"});
    }
})


router.get("/:id",async(req,res)=>{
    try{
        let {id} = req.params;
        let det = await Event.findById(id);
        console.log(id);
        console.log(det);
        res.status(200).json(det);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"error bro"});
    }
})
router.post("/",async(req,res)=>{
    try{
        let data = {
            name:req.body.name,
            date:req.body.date,
            location:req.body.location,
            description:req.body.description,
            createdBy:req.headers["auth"],
        }
        const newevent = new Event(data);
        await newevent.save();
        console.log(newevent);
        res.status(200).json({message:"successfully uploaded bro"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"not uploaded bro"});
    }
    
})

router.put("/edit/:eventId",async(req,res)=>{
    try{
        let {eventId} = req.params;
        let {name,date,location,description} = req.body;
        let userId = req.headers["auth"];
        console.log("IN PUT ROUTE BRO");
        console.log(name);
        console.log(`event id:-${eventId}`);
        console.log(`user id:-${userId}`);
        let det = await Event.findById(eventId);
        console.log(`original creator:-${det.createdBy}`);
        if(String(det.createdBy)!==userId){
            res.status(500).json({error:"you cant edit this bro you are not an admin to this"});
            console.log("You are not an adminstrator to this event");
            return;
        }

        let updateData = await Event.findByIdAndUpdate(eventId,{name,date,location,description},{new:true});
        console.log(updateData);
        res.status(200).json({message:"successfull bro"});
    }
    catch(err){
        res.status(500).json({error:"error bro"});
        console.log(err);
    }
})

router.post("/:eventId",async(req,res)=>{
    try{
        let {eventId} = req.params;
        let userId = req.headers["auth"];
        let data = await User.findById(userId);
        console.log(`event id:-${eventId}`);
        console.log(`user id:-${userId}`);
        let updateData = await Event.findByIdAndUpdate(eventId,{user:userId},{new:true});
        console.log(updateData);

        sendEmail(data.email,"Event Registration confirmed",`you have successfully registered for ${updateData.name} on ${updateData.date}`)
        res.status(200).json({message:"successfull bro"});
    }
    catch(err){
        res.status(500).json({error:"error bro"});
        console.log(err);
    }
})

module.exports = router;