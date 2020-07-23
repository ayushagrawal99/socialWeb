const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/likes');

module.exports.toggleLike = async function(req,res){
    try {
        let Likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            Likeable = await Post.findById(req.query.id).populate('likes');
        } else {
            Likeable = await Comment.findById(req.query.id).populate('likes');
        }

        let existLike = await Like.findOne({
            user : req.user.id,
            likeable : req.query.id,
            onModel : req.query.type
        });

        if(existLike){
            Likeable.likes.pull(existLike);
            Likeable.save();

            existLike.remove();
            deleted = true;
        } else {
            let newLike = await Like.create({
                user : req.user.id,
                onModel : req.query.type,
                likeable : req.query.id
            });

            Likeable.likes.push(newLike);
            Likeable.save();
        }

        if(req.xhr){
            return res.json(200,{
                data : {
                    deleted : deleted
                }, 
                message : " Like created"
            })
        }

        return res.redirect('back');
        
    } catch (error) {
        console.log("error in like controller",error);
        return res.json(500,{
            message : "Internal server error"
        })
    }
}