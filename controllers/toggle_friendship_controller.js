const User = require('../models/users');

// receivefriendRequest --> iska mtlb jb koi frnd req send krega, to jiske pass frnd req jayegi uske user schema ke receivefriendRequest
//  mein jake, jisne frnd req send ki h uski id save ho jayegi

// sendfriendRequest --> iska mtlb jb hum kisi ko frnd req send krenge to hmamare schema ke sendfriendRequest mein, us user ki id save
// kr lenge jisko humne frnd req send ki h 


// This will use for sending a friend request
module.exports.friendReq = async function(req,res){
    try {
        var k=1;  // frnd req send
        let receiver = await User.findById(req.params.id);
        let sender = await User.findById(req.user.id);

        receiver.receivefriendRequest.push(sender.id);
        receiver.save();

        sender.sendfriendRequest.push(receiver.id);
        sender.save();

        console.log("send friend request");

        if(req.xhr){
            return res.status(200).json({
                data : {
                    friend : k
                }, 
                message : "friend request send"
            })
        }
        req.flash('success','Friend Request send successfully');
        return res.redirect('back');

    } catch (error) {
        console.log("error in sending a Friend Request",error);
         return;
    }
}

// if we send already a frnd req then remove it
module.exports.alreadyRequestSent = async function(req,res){
    try {
        k = 2;  // already send a frnd req
        let receiver = await User.findById(req.params.id);
        let sender = await User.findById(req.user.id);

        // ya to meine send kiya hoga friend request tb ye work hoga
        await User.findByIdAndUpdate(receiver.id, { $pull : {receivefriendRequest : sender.id}});
        await User.findByIdAndUpdate(sender.id, { $pull : {sendfriendRequest : receiver.id}});

        // ya to samne wale ne friend request send kiya hoga tb ye work hoga
        await User.findByIdAndUpdate(receiver.id, { $pull : {sendfriendRequest : sender.id}});
        await User.findByIdAndUpdate(sender.id, { $pull : {receivefriendRequest : receiver.id}});

            console.log("friend request cancel");
                if(req.xhr){
                    return res.status(200).json({
                        data : {
                            friend : k
                        }, 
                        message : "friend request delete"
                    })
                }

            req.flash('success','friend request cancel');
            return res.redirect('back');
    } catch (error) {
        console.log("error in sending a Friend Request",error);
         return;
    }
}

// this will accept or reject the friend request from the profile of user
module.exports.sendRequest = async function(req,res){
    try {

        let sender = await User.findById(req.params.id);
        let receiver = await User.findById(req.user.id);

        if(req.body.accept){
            // if user will accept the friend request then run this
            sender.friends.push(receiver.id);
            sender.save();

            receiver.friends.push(sender.id);
            receiver.save();

            await User.findByIdAndUpdate(receiver.id, { $pull : {receivefriendRequest : sender.id}});
            await User.findByIdAndUpdate(sender.id, { $pull : {sendfriendRequest : receiver.id}});

            console.log("friendship stablished");

            req.flash('success','friend request accepted');
            return res.redirect('back');

        } else if(req.body.reject){
            // if user will reject the friend request then run this 

            await User.findByIdAndUpdate(receiver.id, { $pull : {receivefriendRequest : sender.id}});
            await User.findByIdAndUpdate(sender.id, { $pull : {sendfriendRequest : receiver.id}});

            console.log("friend request rejected");

            req.flash('success','friend request rejected');
            return res.redirect('back');
        }

    } catch (error) {
        console.log("error in sending a Friend Request",error);
        return;
    }
}


// thus will delete the friend request
module.exports.deleteFriend = async function(req,res){
    try {

        await User.findByIdAndUpdate(req.user.id, {$pull : {friends : req.params.id}});
        await User.findByIdAndUpdate(req.params.id, {$pull : {friends : req.user.id}});

        console.log("friendship deleted");

        req.flash('success','remove friend');
        return res.redirect('back');
        
    } catch (error) {
        console.log("error in sending a Friend Request",error);
        return;
    }
}

















// <% } else { %>
//     <div id="user-info">
//         <div id="name-user">
//             <a href="/users/profile/<%=profile_user.id%>"><h2><%= profile_user.name%></h2></a>
//         </div>
//         <div id="user-pic-button">
//             <div id="user-picture">
//                 <img src="<%= profile_user.avatar[profile_user.avatar.length-1]%>" alt="<%= profile_user.name%>">
//             </div><%= locals.user.id %>
//             <%  console.log(profile_user.friends.length) %>
//             <% if(locals.user.id == profile_user.friends.id) { %> 
                
//                 <div id="add-friens-button">
//                     <button>
//                         <a href="">
//                             <i class="fas fa-trash-alt"></i>
//                             <span>DELETE FRIEND</span>
//                         </a>
//                     </button>
//                 </div>
//             <% } else if( (profile_user.receivefriendRequest.includes(locals.user.id)) || (profile_user.sendfriendRequest.includes(locals.user.id)) ) {%>
//                 <div id="add-friens-button">
//                     <button>
//                         <a href="">
//                             <i class="fas fa-user-check"></i>
//                             <span>FRIEND REQUEST</span>
//                         </a>
//                     </button>
//                 </div>
//             <% } else {%>
//                 <div id="add-friens-button">
//                     <button>
//                         <a href="">
//                             <i class="fas fa-user-plus"></i>
//                             <span>ADD FRIEND</span>
//                         </a>
//                     </button>
//                 </div>
//             <% } %>
//         </div>
//     </div>
// <% } %>