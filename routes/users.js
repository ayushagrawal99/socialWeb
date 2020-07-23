const express = require('express');
const router = express.Router();
const passport = require('../config/passport_local');

const userController = require('../controllers/users_controller');
router.post('/create',userController.create);    // for sign-up the user

// this url is used for sign-in the user, here we applied passport-local authentication
router.post('/create_session',passport.authenticate(
    'local',
    {failureRedirect : '/'}
),userController.createSession);

router.get('/profile/:id',passport.checkAuthentication,userController.profile);

router.post('/update/:id',passport.checkAuthentication,userController.update);
router.get('/update/delete/',passport.checkAuthentication,userController.deleteImages);

// google will respond on this url when google find out the user on own database
router.get('/auth/google/callback', passport.authenticate(
    'google',
    {failureRedirect : '/'}), 
    userController.createSession);

// this url is used for going to google sign-in page
router.get('/auth/google',passport.authenticate('google',{scope : ['profile','email']}));


router.get('/auth/github', passport.authenticate(
    'github',
    {scope : ['user:email']}
));

router.get('/auth/github/callback', passport.authenticate(
    'github',
    {failureRedirect : '/sign-in'}
),userController.createSession);


module.exports = router;


