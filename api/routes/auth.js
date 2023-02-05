// In routes you create your routes and perform request like create,read,update,delete
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register",async(req,res)=>{ 
    // This is an async function because we can't determine how much time it will take to register in database
    // run a async function in try and catch block
    try{
        //create a salt to bcrypt your password and other data
        const salt = await bcrypt.genSalt(10);
        //use the salt in hash function with your data from requested body
        const hashedPass = await bcrypt.hash(req.body.password,salt); 

        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPass,
        });
 
        const user = await newUser.save();
        // save method is coming from mongoose 

        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
});
//LOGIN

router.post("/login", async(req,res)=>{
    try{
        //findOne function is used to find only unique user
            const user = await User.findOne({username:req.body.username});
            !user && res.status(400).json("wrong credentials!");

            const validate = await bcrypt.compare(req.body.password,user.password);
            !validate && res.status(400).json("wrong credentials!");
            
            //This is used to exclude password from the response json data only "...others" is send in json
            const {password, ...others} = user._doc;
            // _doc contains only needed data don't show any additional information
            res.status(200).json(others);
    }
    catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;