const User = require('../models/users');

// when user sign-up the form
module.exports.create = async function(req,res){
    try {
        if(req.body.password != req.body.confirm_password){
            return res.redirect('back');
        }
        let user = await User.findOne({email : req.body.email});

        if(user){
            return res.redirect('/sign-in');
        } else {
            await User.create(req.body);
            req.flash("success",'user successfully sign-up');
            return res.redirect('/sign-in');
        }
    } catch (error) {
        console.log("error in user create",error);
        return res.redirect('back');
    }
}

// when user try to sign-in 
module.exports.createSession = function(req,res){
    req.flash("success",'user successfully logged in');
    return res.redirect('/home');
}

// this will open user profile page
module.exports.profile = async function(req,res){
    try {
        let user = await User.findById(req.params.id);

        return res.render('profile',{
            title : "profile Page",
            profile_user : user
        })
    } catch (error) {
        console.log("error in profile",error);
        return;
    }
}

// this will update the user profile
module.exports.update = async function(req,res){
    try {
        if(req.params.id == req.user.id){
            let user = await User.findById(req.params.id);
              User.uploadedAvatar(req,res, function(err){
                if(err){console.log("error in file upload",err); return;}

                user.name = req.body.name;
                user.email = req.body.email;
                user.phone = req.body.phone;

                if(req.file){
                    // this is the path where file will be store
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            })
        }
    } catch (error) {
        console.log("error in upload user profile");
        return;
    }
}