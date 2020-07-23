const express = require('express');
const router = express.Router();
const passport = require('../config/passport_local');

const postSchema = require('../controllers/post_controller');

router.post('/create',passport.checkAuthentication,postSchema.createPost);

router.get('/delete/:id',passport.checkAuthentication, postSchema.deletePost);
module.exports = router;