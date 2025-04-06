// const {Schema,model}=require("mongoose");
const {Schema,model} = require("mongoose")
const bcrypt=require("bcrypt")
const userSchema=new Schema(
    {
        name:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,

        },
        password:{
            type:String,
            required:true,
        },
        profilePicture:{
            type:String,
            default:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        },
        totalNumberOfTask:{
            type:Number,
            default:0,
        },
        role:{
            type:String,
            enum:["normalUser","admin"],
            default:"normalUser",
        }
    },
    {
      timestamps:true
    }
)

// password hashing
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
       return next();
    }
    let salt=await bcrypt.genSalt(10);
    let hashedPassword=await bcrypt.hash(this.password,salt);
    this.password=hashedPassword;
    
})

userSchema.methods.comparePassword=async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
    
}

module.exports=model("User",userSchema);


// connect mongoDb with nodeJs
// const {MongoClient}=require('mongodb');

// const connectDB=async()=>{
//    let client= await MongoClient.connect("mongodb://localhost:27017");
//    let database=client.db("expressDB");
//    let collection= await database.createCollection("users");
//    return collection;
// }


