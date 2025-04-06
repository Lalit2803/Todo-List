const jwt=require("jsonwebtoken")
const asyncHandler=require("express-async-handler")
const { JWT_SECRET } = require("../config")

exports.generateToken=asyncHandler(async(id)=>{
    return  jwt.sign({id},JWT_SECRET,{expiresIn:"1d"})   // sign will generate the token
})

/*
token has three part ==>
1 HEADER:ALGORITHM & TOKEN TYPE
2 PAYLOAD:DATA
3 VERIFY SIGNATURE


*/