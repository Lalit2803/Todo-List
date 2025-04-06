const mongoose = require("mongoose");
const {MONGODB_URL} = require(".");
exports.connectDB=async()=>{
    await mongoose.connect(MONGODB_URL);
    console.log("Database is connected")
}