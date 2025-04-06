const ErrorHandler = require("../utils/errorHandler")

exports.authorize=(req,res,next)=>{
    if(req.user.role==="normalUser"){
        throw new ErrorHandler(403,"You are not authorized to access this resource")
    }
    next();

}