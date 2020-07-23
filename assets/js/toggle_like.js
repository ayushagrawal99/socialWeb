class Togglelike{
    constructor(toggleElement){
        // yaha "toggleElement" mein ye .toggle-like-buttons html class ki value pass hoga.
        this.toggler = toggleElement;
        this.toggleLike();
    }
    toggleLike(){
        let pSelf = this;
        $(pSelf.toggler).click(function(e){
            e.preventDefault();

            let self = this;

            $.ajax({
                type : 'post',
                url : $(self).prop('href'),
                success : function(data){
                    let likesCount = parseInt($(self).attr('data-like'));
                    if(data.data.deleted == true){
                        likesCount -= 1; 
                    } else {
                        likesCount += 1;
                    }
                    $(self).attr('data-like',likesCount);
                    $(self).html(`${likesCount} LIKES`);        

                }, error : function(err){
                    console.log(err);
                }
            })
        })
    }
}