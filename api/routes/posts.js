// In routes you create your routes and perform request like create,read,update,delete
const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//CREATE USER
router.post("/",async(req,res)=>{ 
        const newPost = new Post(req.body);
        try{
                const savedPost = await newPost.save();
                res.status(200).json(savedPost);
        }
        catch(err){
            res.status(500).json(err);
        }
});

//UPDATE USER
router.put("/:id",async(req,res)=>{ 
   try{
    const post = await Post.findById(req.params.id);
            if(post.username ===  req.body.username){
                    try{
                        const updatePost = await Post.findByIdAndUpdate(req.params.id,{
                            $set: req.body
                        },{new: true});
                        res.status(200).json(updatePost);
                    }
                    catch(err){
                        res.status(500).json(err);
                    }
            }
            else{
                res.status(401).json("you can update only your post");
            }

   }
    catch(err){
        res.status(500).json(err);
   }
});

//DELETE POST

router.delete("/:id", async(req,res)=>{
    if(req.params.id === req.body.userId){
        try{
            const post = await Post.findById(req.params.id);
            
            await post.delete();
            res.status(200).json("the post has been deleted");
        }
        catch(err){
            res.status(500).json(err);
        }
        }   
    else{
        res.status(401).json("you can delete only your post");
    }
});

// GET POST

router.get("/:id", async(req,res)=>{
    if(req.params.id === req.body.userId){
            try{
                    const post = await Post.findById(req.params.id);
                    res.status(200).json(post);
            }
            catch(err){
                res.status(500).json(err);
            }
    }
    else{
        res.status(404).json("you can view only your post");
    }
});

//GET ALL POSTS
router.get("/", async( req,res)=>{
        const username = req.query.user;
        const catName = req.query.cat;

        try{
            let posts;
            if(username){
                posts = await Post.find({username});
            }
            else if(catName){
                posts = await Post.find({
                    categories:{
                        $in:[catName],
                    },
                });
            }
            //if the posts don't have any categories simply return all the categories
            else{
                posts = await Post.find();
            }
            res.status(200).json(posts);
        }   
        catch(err){
            res.status(500).json(err);
        }
});



module.exports = router;