{
    let createPost = function(){
console.log("creating psot by AJAX")

        let newPostForm = $('#form-post');
        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type : 'POST',
                url : '/post/create',
                data : newPostForm.serialize(),
                success : function(data){
                   let postDOM = createDomPost(data.data.post);
                   $('#post-container>ul').prepend(postDOM);
                   $('textarea').val('');
                    deletePost($(' .delete-post', postDOM));
                    new postComment(data.data.post._id);

                    new Togglelike($(' .toggle-like-button', postDOM));
                }, error : function(err){
                    console.log(err.responseText);
                }
            })
        })
    }

    let createDomPost = function(post){
        return $(`<li id="post-${ post._id}" class="post-list">
            <div id="post-info">




                ${ post.user.avatar.length > 0 ?
                    `<img class="post-info-img" src="${ post.user.avatar[post.user.avatar.length-1]}" alt="${ post.user.name}">`  
                    :
                    `<img src="/images/avtar_pic-8b6d919964.jpg" alt="" style="height: 40px; width: 40px;">`
                }

 

                <a href="/users/profile/${ post.user._id}"><p class="post-user">${ post.user.name}</p></a>
            </div>
            <p class="post-cont">${post.content}</p>
            <a class="toggle-like-button" data-like="0" href="/likes/toggle/?id=${ post._id}&type=Post">${ post.likes.length}<i class="far fa-thumbs-up"></i> LIKE</a>
            <a href="/post/delete/${ post._id}" class="delete-post"><i class="far fa-trash-alt"></i><span>Delete</span></a>
        
            <div id="comment">
                <form class="comment-form" action="/comment/create" method="POST" id="new-post-comment-${ post._id}">
                    <input type="text" name="content" placeholder="comment here.." required>
                    <input type="hidden" name="post" value="${ post._id}">
                    <input type="submit" value="comment">
                </form>
                <div id="comment-container">
                    <ul id="post-comment-${ post._id}">
                        
                    </ul>
                </div>
            </div>
        </li>`)
    }

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            
            $.ajax({
                type : 'get',
                url : $(deleteLink).prop('href'),
                success : function(data){ 
                   $(`#post-${data.data.id}`).remove();   
                }, error : function(error){
                   console.log(error.responseText);
                }
            })
        })
    }

    // hume saare old post ko v to ajax ke through initalize krwana hoga na warna wo normally delete honge.
    let convertPostToAjax = function(){
        $('#post-container>ul>li').each(function(){
            let iself = $(this);
            // $(this)  iska matlb hai ki wo apne current html element ko target kar rha h i.e wo abbi <li> element ko target kr rha h
            let dltbtn = $(' .delete-post',iself);
            deletePost(dltbtn);

            // jo v post create hue honge ajax ki help se un post ke saare comments ko initalize krenge so wo ajax se work kre
            let postId = iself.prop('id').split("-")[1];     
            new postComment(postId);
        })
    }
    createPost();
    convertPostToAjax();
}










