const todoModel = require("../models/todo.model");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const userModel=require("../models/user.model");
const {parse,format}=require("date-fns");

exports.addTodo = asyncHandler(async (req, res) => {
 // console.log(req.user._id);
  let { title, description, dueDate, priority, status } = req.body;
  // user will enter date in this format ==>dd/mm/yyyy
  // parse store in yyyy/mm/dd


  let parsedDate=parse(dueDate,"dd/MM/yyyy",new Date())
  let newTodo = await todoModel.create({
    title,
    description,
    dueDate:parsedDate,
    priority,
    status,
    createdBy: req.user._id,
  });

  let user=await userModel.findById(req.user._id);
  await userModel.updateOne({_id:user._id},{$inc:{totalNumberOfTask:1}})

  // await userModel.updateOne({_id:user._id},{$inc:{totalNumberOfTask:1}})

  res.status(201).json({ message: "Todo added successfully", data: newTodo });
});

exports.fetchAllTodos = asyncHandler(async (req, res) => {
  //let allTodo = await todoModel.find({ createdBy: req.user._id });

  let filter={ createdBy: req.user._id }
  if(req.query.status){
    filter.status=req.query.status;   // ?status=false/true
  }


  if(req.query.priority){
    filter.priority=req.query.priority;  // ?priority=low/medium/high
  }

  let sortOption={};
  if(req.query.sort){
    const [field,value]=req.query.sort.split("_"); // ("dueDate","asc")s
    if(field==="dueDate" && (value==="asc" || value==="desc")){
      let order=value==="asc" ? 1:-1;
      sortOption[field]=order;               // ?sort=dueDate_asc/dueDate_desc
    }
  }


  // console.log(filter)
  // console.log(sortOption)
  let allTodo=await todoModel.find(filter).sort(sortOption);
  
  let todos=allTodo.map((todo)=>({...todo._doc,
    dueDate:format(todo.dueDate,"EEE dd MMMM yyyy"),
      createdAt:format(todo.createdAt,"dd MMMM yyyy"),
        updatedAt:format(todo.updatedAt,"dd MMMM yyyy"),
    }))

  if (allTodo.length === 0) {
    throw new ErrorHandler(404, "No todos find");
  }
  res
    .status(200)
    .json({
      success: true,
      count: allTodo.length,
      message: "fetched successfully",
      todos,
    });
    
});


exports.fetchOneTodo = asyncHandler(async (req, res) => {



  let todo = await todoModel.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });
  if (!todo) {
    throw new ErrorHandler(404, "No todos find");
  }
  res
    .status(200)
    .json({
      success: true,
      count: todo.length,
      message: "fetched successfully",
      todo,
    });
});

// exports.deleteTodo=asyncHandler(async(req,res)=>{
//     let {id}=req.params;
//     let todoExist=await todoModel.findOne({_id:id,createdBy:req.user._id});
//     if(!todoExist){
//         throw new ErrorHandler(404,"No todo found")
//     }
//     let deleteTodo=await todoModel.findByIdAndDelete(todoExist._id);
//     res.status(200).json({success:true,message:"deleted successfully",deleteTodo})
// })

exports.deleteTodo = asyncHandler(async (req, res) => {

  let deleteTodo = await todoModel.findOneAndDelete({
    $and: [{ _id: req.params.id }, { createdBy: req.user._id }],
  });
  if (!deleteTodo) {
    throw new ErrorHandler(404, "No todos find");
  }
  await userModel.findByIdAndUpdate(req.user._id,{$inc:{totalNumberOfTask:-1}})
  
  res.status(200).json({ success: true, message: "deleted successfully", deleteTodo });
});

exports.updateTodo = asyncHandler(async (req, res) => {
  let updateTodo = await todoModel.findOneAndUpdate(
    { $and: [{ _id: req.params.id }, { createdBy: req.user._id }] },
    { $set: req.body },
    { new: true, runValidators: true }// it will check the schema for validations against new data
  );
  if (!updateTodo) {
    throw new ErrorHandler(404, "No todos find");
  }
  res
    .status(200)
    .json({ success: true, message: "todo updated successfully", updateTodo });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  let updateTodo = await todoModel.findOneAndUpdate(
    { $and: [{ _id: req.params.id }, { createdBy: req.user._id }] },
    { $set: {status:status} },
    { new: true, runValidators: true }// it will check the schema for validations against new data
  );
  if (!updateTodo) {
    throw new ErrorHandler(404, "No todos find");
  }
  res
    .status(200)
    .json({ success: true, message: "todo status updated successfully", updateTodo });
});
