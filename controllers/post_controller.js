const Post = require('../models/post');
const Like = require('../models/likes');
const Comment = require('../models/comment');

// this will create a post
module.exports.createPost = async function(req,res){
    try {
        let post = await Post.create({
            content : req.body.content,
            user : req.user.id
        });

        post = await post.populate('user','avatar email name').execPopulate();

        if(req.xhr){
            return res.json(200,{
                data : {
                    post : post
                },
                message : "post created"
            })
        }
        
        req.flash('success','post created successfully');
        return res.redirect('back');

    } catch (error) {
        console.log("Error in post creation",error);
        return;
    }
}

// this will delete the post
module.exports.deletePost = async function(req,res){
    try {
        let post = await Post.findById(req.params.id);
        
        if(post.user == req.user.id){
            post.remove();
            
            await Comment.deleteMany({post : req.params.id});

            await Like.deleteMany({likeable : post._id, onModel : 'Post'});
            await Like.deleteMany({_id : {$in : post.comments}});

            if(req.xhr){
                return res.json(200 , {
                    data : {
                        id : req.params.id
                    },
                     message : "delete post"
                })
            }

            req.flash('success','post deleted');
            return res.redirect('back');
       } else{
            return res.redirect('back');
       }
    } catch (error) {
        console.log("Error in post deletion",error);
        return;
    }
}