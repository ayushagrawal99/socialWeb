const express = require('express');
const router = express.Router();
const passport = require('../config/passport_local');

const friendshipController = require('../controllers/toggle_friendship_controller');
router.get('/send-request/:id',passport.checkAuthentication, friendshipController.friendReq );

router.post('/accept-reject/:id',friendshipController.sendRequest);

router.get('/already-send-request/:id',friendshipController.alreadyRequestSent);

router.get('/delete-friend/:id', friendshipController.deleteFriend);

module.exports = router;