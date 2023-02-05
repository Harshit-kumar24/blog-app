// In routes you create your routes and perform request like create,read,update,delete
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");

//UPDATE USER
router.put("/:id",async(req,res)=>{ 
        if(req.body.userId === req.params.id){
            if(req.body.password){
                const salt = bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            }
            try{
                const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                    //set method is used to set all the data from the body
                    $set: req.body,
                    // new: true method is used to set the data to the newely update one 
                },{new:true});
                res.status(200).json(updatedUser);
              
            }catch(err){
                res.status(500).json(err);
            }
        }
        else{
            res.status(401).json("you can update only your account");
        }
});

//DELETE USER
router.delete("/:id",async(req,res)=>{ 
    //check if users userId and the user to be deleted id are matching
    if(req.body.userId === req.params.id){
        try{
                // if yes find the specific "User"
            const user = await User.findById(req.params.id);
            try{
                // delete all the posts belongs to that specific username
                await Post.deleteMany({ username: user.username });
                //then delete the user
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("user has been deleted");
                
            }catch(err){
                res.status(500).json(err);
            }
        }
        catch(err){
                res.status(404).json("user not found");
    }
    }
    else{
        res.status(401).json("you can delete only your account");
    }
});

// GET USER

router.get("/:id", async(req,res)=>{
    try{
            const user = await User.findById(req.params.id);

            const{password, ...others} = user._doc;
            res.status(200).json(others);
    }
    catch{
        res.status(500).json(err);
    }
})



module.exports = router;