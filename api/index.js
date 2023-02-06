const express = require('express');
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const {PORT, MONGO_URL} = require('./config/serverConfig');
const  path  = require('path');

//to send the data in json format
app.use(express.json());
app.use("/images",express.static(path.join(__dirname,"/images")));

//to supress deprication warning
mongoose.set('strictQuery',false);

//connecting to the DB using mongoose
mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(console.log("connected to DB")).catch((err)=>console.log(err));

//UPLOADING AN IMAGE
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images")
    },filename:(req,file,cb)=>{
        cb(null,"hello.jpeg");
    }
});

const upload = multer({storage:storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
            res.status(200).json("file has been uploaded");
});

//MIDDLEWARES
app.use("/api/posts",postRoute);
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/categories",categoryRoute);

 

//listening our express server on port 5000
app.listen(PORT,()=>{
        console.log("server is online");
});
