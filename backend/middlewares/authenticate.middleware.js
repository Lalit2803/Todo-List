const asyncHandler = require("express-async-handler");
const jwt=require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const userModel = require("../models/user.model");
const ErrorHandler = require("../utils/errorHandler");

exports.authenticate=asyncHandler(async(req,res,next)=>{
    //   let cookie = req.cookies;
  //   let cookie1 = req.cookie;
  //   console.log(cookie);
  //   console.log(cookie1);
//   console.log(req.cookies);
let cookie=req?.cookies?.mycookie;
if(!cookie || cookie===null ){
    throw new ErrorHandler(401,"Please login to access this resource")
}
// next();
//decrypt the cookie
 let decodedCookie=jwt.verify(cookie,JWT_SECRET);
 //console.log(decodedCookie)
//  next();

// finding the user based on id
 let myUser=await userModel.findById(decodedCookie.id);
 req.user=myUser;
next();
})