const express = require("express"); // Use CommonJS require
const { connectDB } = require("./config/db");
const { PORT } = require("./config");
const cors = require("cors");
const userRoutes=require("./routes/user.routes");
const todoRoutes=require("./routes/todo.routes");
const adminRoutes=require("./routes/admin.routes");
const { error } = require("./middlewares/error.middleware");
const cookieParser=require("cookie-parser")


connectDB();
const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/lps/user",userRoutes);
app.use("/lps/todos",todoRoutes);
app.use("/lps/admin",adminRoutes)

app.use(error)

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log("Express server is listening on port", PORT);
});
