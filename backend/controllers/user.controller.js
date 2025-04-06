let USER_SCHEMA=require("../models/user.model");
const asyncHandler = require("express-async-handler");  // to catch error
const ErrorHandler = require("../utils/errorHandler");
const { generateToken } = require("../utils/jwt");
// const uploadOnCloudinary = require("../utils/uploadOnCloudinary");
const{uploadOnCloudinary, deleteFromCloudinary}=require("../utils/uploadOnCloudinary")
const userModel = require("../models/user.model");
const { extractPublicId } = require("../utils/extractPublicid");

exports.registerUser=asyncHandler(async(req,res)=>{
    //console.log(req.file)
    let{name,email,password,role}=req.body;
    let existingUser= await USER_SCHEMA.findOne({email});
    if(existingUser){
        throw new ErrorHandler(409,"User already exist with this email ,please login instead");
    }
    //console.log(req?.file?.path);
    let uploadedResponse=await uploadOnCloudinary(req?.file?.path);
    //console.log(uploadedResponse)
    /*
    response=  
    {
  asset_id: '3d9dd29b5c77cfd219d05bc277e7dd24',
  public_id: 'taskify/gcndvagbuwhifw3lieao',
  version: 1742465771,
  version_id: 'b879bf038683afcf8c6b8141b9ea7c35',
  signature: '7c15d5093bdad801cec11a6d0881a867acad39f4',
  width: 800,
  height: 800,
  format: 'webp',
  resource_type: 'image',
  created_at: '2025-03-20T10:16:11Z',
  tags: [],
  pages: 1,
  bytes: 77358,
  type: 'upload',
  etag: '494d4ec92ad5c492c5b6d709bb49385c',
  placeholder: false,
  url: 'http://res.cloudinary.com/doxxnms9w/image/upload/v1742465771/taskify/gcndvagbuwhifw3lieao.webp',
  secure_url: 'https://res.cloudinary.com/doxxnms9w/image/upload/v1742465771/taskify/gcndvagbuwhifw3lieao.webp',
  asset_folder: 'taskify',
  display_name: 'gcndvagbuwhifw3lieao',
  original_filename: '1742465764558-profile',
  api_key: '559592535329883'
}


    */
    let newUser=await USER_SCHEMA.create({name,email,password,role,profilePicture:uploadedResponse?.secure_url});
    res.status(201).json({ success:true,message:"user registered successfully",newUser})
})

exports.loginUser=asyncHandler(async(req,res)=>{
    let {email,password}=req.body;
    let existingUser=await USER_SCHEMA.findOne({email});
    if(!existingUser){
        throw new ErrorHandler(409,"email doesn't exist please signup first");
    }
    let match=await existingUser.comparePassword(password);
    if(!match){
        throw new ErrorHandler(400,"password does not match, please enter correctly");

    }

    //if match then geerate token
    let token=await generateToken(existingUser._id);
     //console.log(token);

    res.cookie("mycookie",token,{maxAge:1*60*60*1000, httpOnly:true})

    res.status(201).json({ success:true,message:"user login successfully",token})

})


exports.logOutUser=asyncHandler(async(req,res)=>{
        res.clearCookie("mycookie","",{maxAge:0});
        
    res.status(200).json({ success: true, message: "user logged out" });
        
})

// update everything except profile picture
exports.updateUserProfile=asyncHandler(async(req,res)=>{
    let user=await userModel.findById(req.user._id);
    user.name=req.body.name || user.name;
    user.email=req.body.email || user.email;
    user.password=req.body.password || user.password;
    user.totalNumberOfTask=req.body.totalNumberOfTask || user.totalNumberOfTask
    await user.save();   // save methods follow the pre hooks before save   generally we use it for update password
    res.status(200).json({success:true, message:"user updated successfully",user})
})

// update password
exports.updatePassword = asyncHandler(async (req, res) => {
    let user = await userModel.findById(req.user._id);
  
    user.password = req.body.password;
  
    await user.save();
  
    res.status(200).json({ success: true, message: "password updated successfully" });
  });

exports.updateProfilePicture=asyncHandler(async(req,res)=>{
    //console.log("req.user:", req.user);

    let user=await userModel.findById(req.user._id);
    let defaultPic="https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    if(user.profilePicture!==defaultPic){

        let url=user.profilePicture;

        let urlParts=url.split("/");
        let public_id=urlParts[urlParts.length-1].split(".")[0];
        let id="taskify/"+public_id;
        await deleteFromCloudinary(id);

    }
    let = newLocalFilePath=req.file.path;
    let uploadedResponse=await uploadOnCloudinary(newLocalFilePath);
    user.profilePicture=uploadedResponse?.secure_url;
    await user.save();

    res.status(200).json({success:true, message:"profile picture updated successfully"})



})


exports.deleteProfilePicture=asyncHandler(async(req,res)=>{
    let user=await userModel.findById(req.user._id);
    let url=user.profilePicture;

    let urlParts=url.split("/");
    let public_id=urlParts[urlParts.length-1].split(".")[0];
    let id="taskify/"+public_id;
    let deletedImage=await deleteFromCloudinary(id);
    user.profilePicture="https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    await user.save();

    res.status(200).json({success:true, message:"profile picture deleted successfully",deletedImage})


})



exports.deleteUserProfile=asyncHandler(async(req,res)=>{
    let user=await userModel.findById(req.user._id);
    let defaultPicURL="https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    if(user.profilePicture!==defaultPicURL){
        let id=extractPublicId(user.profilePicture);
        await deleteFromCloudinary(id);

    }
    let deleteUser=await userModel.findByIdAndDelete(req.user._id);
    if(!deleteUser){
        throw new ErrorHandler(409,"no user found");

    }
    res.status(200).json({success:true, message:"user deleted successfully",deleteUser})
})



exports.getCurrentUser=asyncHandler(async(req,res)=>{
    let user=await userModel.findById(req.user._id)
    res.status(200).json({success:true,user})
})