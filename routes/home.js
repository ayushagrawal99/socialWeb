const express = require('express');
const router = express.Router();
const passport = require('../config/passport_local');

const home_controller = require('../controllers/home_controller');
router.get('/',home_controller.signUp);

router.get('/sign-in',home_controller.signIn);
router.get('/home',passport.checkAuthentication,home_controller.home);

router.use('/users', require('./users'));

router.get('/sign-out',home_controller.signOut);

router.use('/forget-password',require('./forget_password'));

router.use('/friendship',require('./friendship'));

router.use('/post',require('./posts'));
router.use('/comment', require('./comment'));

router.use('/likes',require('./likes'));

module.exports = router;