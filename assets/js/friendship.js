// {
//     let createFriend = function(){
//         let sendRequest = $('.send-friend-request');
//         sendRequest.click(function(e){
//             e.preventDefault();

//             $.ajax({
//                 type : 'GET',
//                 url : sendRequest.prop('href'),
//                 success : function(data){
//                     if(data.data.friend == 1){
//                         console.log("send")
//                         $(sendRequest).html('<i class="fas fa-user-check"></i>');
//                     } 
//                     deleteRequest();
//                 }
//             })
//         })
//     } 

//     let deleteRequest = function(){
//         let dltreq = $('.friend-request');
//         dltreq.click(function(e){
//             e.preventDefault();

//             $.ajax({
//                 type : 'GET',
//                 url : dltreq.prop('href'),
//                 success : function(data){
//                     if(data.data.friend == 2){
//                         console.log("delete")
//                         $(dltreq).html('<i class="fas fa-user-plus"></i>');
//                     }
//                 }
//             })
//         })
//     }
//     createFriend();
// }