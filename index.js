const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const port = 7095;
const app = express();
const cron  = require("node-cron");
const Event = require("./models/eventmodel");
const sendEmail = require("./emailService");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const eventRoutes = require("./routes/eventRoutes")
const userRoutes = require("./routes/userRoutes")

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connected successfully");
})
.catch((err)=>{
    console.log(err);
})





cron.schedule("0 0 * * *",async()=>{
    console.log("checking for upcoming events");
    const tomorrow = new Date();
    console.log(tomorrow);
    tomorrow.setDate(tomorrow.getDate()+1);
    const formattedDate = tomorrow.toISOString().split("T")[0];

    const events = await Event.find({date:formattedDate});

    events.foreach(
        (event)=>{
            if(event.user){
                return ;
            }
            sendEmail(event.mail,"Event Remanider",`Remainder:your event is happening on tomorrow ${formattedDate}`);
        }
    )

})







app.listen(port,()=>{
    console.log(`server is running on port:-${port}`);
})

app.get("/",(req,res)=>{
    res.send("Campus event project is running bro");
})

app.use("/api/events",eventRoutes);
app.use("/api/auth",userRoutes);