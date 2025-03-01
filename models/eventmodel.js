const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name:String,
    date:String,
    location:String,
    description:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null,
    }
});

module.exports = mongoose.model("event",schema);