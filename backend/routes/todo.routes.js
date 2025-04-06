const {Router}=require("express");
const { addTodo, fetchAllTodos, fetchOneTodo, deleteTodo, updateTodo, updateStatus } = require("../controllers/todo.controller");
const { authenticate } = require("../middlewares/authenticate.middleware");
const router=Router();

router.post("/addtodo",authenticate,addTodo);
router.get("/alltodo",authenticate,fetchAllTodos)
router.get("/todo/:id",authenticate,fetchOneTodo)
router.delete("/deletetodo/:id",authenticate,deleteTodo)
router.put("/updatetodo/:id",authenticate,updateTodo)
router.put("/updatestatus/:id",authenticate,updateStatus)
module.exports=router;