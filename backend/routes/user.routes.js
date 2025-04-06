const {Router}=require("express");
const { registerUser, loginUser,logOutUser, updateUserProfile, deleteUserProfile, deleteProfilePicture, updateProfilePicture, getCurrentUser, updatePassword } = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middleware");
const { authenticate } = require("../middlewares/authenticate.middleware");
const router=Router();

router.post("/register",upload.single("profilePicture"),registerUser);
router.post("/login",loginUser);
router.get("/logout",logOutUser);
router.put("/updatepassword/:id",authenticate,updatePassword);
router.put("/updateuserprofile",authenticate,updateUserProfile);
router.patch("/deleteprofilepic",authenticate,deleteProfilePicture)
router.delete("/deleteuserprofile",authenticate,deleteUserProfile)
router.patch("/updateprofilepicture",upload.single("profilePicture"),authenticate,updateProfilePicture);
router.get("/currentuser",authenticate,getCurrentUser)
module.exports=router;