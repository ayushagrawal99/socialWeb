const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/likes');

// this will create a comment
module.exports.create = async function(req,res){
    try{
        let post = await Post.findById(req.body.post);

        if(post){
            let comment = await Comment.create({
                content : req.body.content,
                user : req.user.id,
                post : req.body.post
            });

            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user','name email avatar').execPopulate();
     
            if(req.xhr){
                return res.json(200,{
                    data : {
                        comment : comment
                    },
                    message : 'comment created'
                })
            }

            req.flash('success','Comment created Successfully');
            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch(err){
        console.log("error in comment creation",err);
        return;
    }
}

// it will delete the comment
module.exports.delete = async function(req,res){
    try {
        let comment = await Comment.findById(req.params.id);
        
        let postId = comment.post;
        comment.remove();

        await Post.findByIdAndUpdate(postId, { $pull : {comments : req.params.id}});

        await Like.deleteMany({likeable : comment._id, onModel : 'Comment'})
        
        if(req.xhr){
            return res.json(200,{
                data : {
                    id : req.params.id
                },
                message : "delete comment"
            })
        }
        req.flash('success', 'comment delete successfully');
        return res.redirect('back');
    } catch (error) {
        console.log("error in comment delete",error);
        return;
    }
}





