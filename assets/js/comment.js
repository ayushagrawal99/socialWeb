class postComment{
    constructor(postID){
        this.postID = postID;
        this.newCommentForm = $(`#new-post-comment-${postID}`);
        this.commentContainer = $("#comment-container>ul>li");
        this.createComment(postID);

        let self = this;
         
        $(' .delete-comment', self.commentContainer).each(function(){                 
            self.deleteComment($(this));
        });
    }
    
    createComment(postID){
        console.log(postID)
        let pself = this;
        pself.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;
            $.ajax({
                type : 'post',
                url : '/comment/create',
                data : $(self).serialize(),
                success : function(data){
                    let commentdata = pself.commentDom(data.data.comment);
                    $(`#post-comment-${postID}`).prepend(commentdata);
                    $('input[type=text').val('');

                    pself.deleteComment($(' .delete-comment',commentdata));

                    new Togglelike($(' .toggle-like-button', commentdata));
                },  error : function(err){
                    console.log(err);
                }
            })
        })
    }

    commentDom(comment){
        return $(`<li id="comment-${ comment._id}" class="comment-list">
        <div id="comment-info">

            ${ comment.user.avatar.length > 0 ?
                `<img class="cmnt-img" src="${ comment.user.avatar[comment.user.avatar.length-1] }"" alt="${ comment.user.name}">`  
                :
                `<img src="/images/avtar_pic-8b6d919964.jpg" alt="" style="height: 30px; width: 30px;">`
            }

            <a href="/users/profile/${comment.user._id}"><p class="cmt-name">${ comment.user.name}</p></a>
        </div>
        <p class="cmnt-cnt">${ comment.content}</p>
        <a id="like" class="toggle-like-button" data-like="0" href="/likes/toggle/?id=${ comment._id}&type=Comment">${ comment.likes.length} <i class="far fa-thumbs-up"></i> LIKE</a>
        <a href="/comment/delete/${ comment._id}" class="delete-comment"><i class="far fa-trash-alt"></i><span>Delete</span></a>
    </li>`)
    }


deleteComment(deleteLink){
    $(deleteLink).click(function(e){
        e.preventDefault();

        $.ajax({
            type : 'get',
            url : $(deleteLink).prop('href'),
            success : function(data){
                $(`#comment-${data.data.id}`).remove();
            }, error : function(err){
                console.log(err);
            }
        })
    })
}

}

