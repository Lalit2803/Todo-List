const {Router}=require("express");
const { authenticate } = require("../middlewares/authenticate.middleware");
const { fetchAllUser, fetchOneUser, fetchAllTodos, updateUserRole, fetchOneTodos } = require("../controllers/admin.controller");
const { authorize } = require("../middlewares/authorize.middleware");

const router=Router();
router.get("/fetchall",authenticate,authorize,fetchAllUser);
router.get("/fetchone/:id",authenticate,authorize,fetchOneUser);
router.put("/updaterole/:id",authenticate,authorize,updateUserRole);
router.get("/fetchalltodo",authenticate,authorize,fetchAllTodos);
router.get("/fetchonetodo/:id",authenticate,authorize,fetchOneTodos);

module.exports=router;