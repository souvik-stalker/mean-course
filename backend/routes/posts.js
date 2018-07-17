const express = require('express');
const Post = require('../models/post');
const router = express.Router();


router.post('',(req,res,next)=>{
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then((addedPost)=>{
    console.log(addedPost);
    res.status(201).json({
      message:'Post addedd Successfully',
      post:addedPost
    });
    },(err)=>{
        res.status(400).send(err);
    });

});
router.get('',(requestAnimationFrame,res,next)=>{
  Post.find()
  .then((posts)=> {
    res.status(200).json({
      message:"Post fetched Successfully",
      posts:posts
    });
  }).catch((e)=> {
    res.status(404).json({
      message:"Error Occured",
      error:e
    });
  })
});

router.delete('/:id',(req,res,next)=> {
  var id = req.params.id;
  Post.deleteOne({_id:id}).then((result)=>{
    res.status(200).json({
      message:"Post Deleted"
    });
  }).catch((e)=>{
    res.status(404).json({
      message:"Error Occured",
      error:e
    });
  });

});

router.put("/:id",(req,res,next)=> {
  const post = new Post({
    _id:req.params.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id:req.params.id},post).then((result)=> {
    res.status(200).json({
      message:"Update Successful"
    });
  }).catch((e)=>{
    res.status(404).json({
      message:"Error Occured",
      error:e
    });
  });
});

router.get("/:id",(req,res,next)=>{
  Post.findById(req.params.id).then((post)=>{
    if(post){
      res.status(202).json({post});
    } else {
      res.status(404).json({
        message:"Post not Found"
      });
    }
  }).catch((e)=>{
    res.status(404).json({
      message:"Error Occured"
    });
  })
});

module.exports = router;
