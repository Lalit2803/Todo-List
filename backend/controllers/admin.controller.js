const userModel =require("../models/user.model");
const todoModel =require("../models/todo.model");
const asyncHandler=require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");

exports.fetchAllUser=asyncHandler(async(req,res)=>{
    let users=await userModel.find();
    if(users.length===0){
        throw new ErrorHandler(404,"no user found")
    }
    res.status(200).json({success:true,message:"all users fetched successfully",users})
});


exports.fetchOneUser=asyncHandler(async(req,res)=>{
    let user=await userModel.findById(req.params.id);
    if(!user){
        throw new ErrorHandler(404,"no user found")
    }
    res.status(200).json({success:true,message:" user fetched successfully",user})
});

exports.updateUserRole=asyncHandler(async(req,res)=>{
    let user=await userModel.findById(req.params.id);
    if(!user){
        throw new ErrorHandler(404,"no user found")
    }
    if(user.role=="normalUser"){
        user.role=req.body.role;
        await user.save();
    }
    res.status(200).json({success:true,message:" user role updated successfully",user})



});

exports.fetchAllTodos=asyncHandler(async(req,res)=>{
    let todos=await todoModel.find();
    if(todos.length===0){
        throw new ErrorHandler(404,"no user found")
    }
    res.status(200).json({success:true,message:"all users fetched successfully",todos})

});

exports.fetchOneTodos=asyncHandler(async(req,res)=>{
    let todo=await todoModel.findById(req.params.id);
    if(!todo){
        throw new ErrorHandler(404,"no user found")
    }
    res.status(200).json({success:true,message:" user fetched successfully",todo})
});