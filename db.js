const mongoose = require("mongoose")

const db = async()=>{
    await mongoose.connect("mongodb://localhost:27017/fact")
    console.log("connected with mongoose")
}

module.exports  = db;