const express = require('express');
const router = express.Router();

const likeController = require('../controllers/toggle_like_controller');
router.post('/toggle',likeController.toggleLike);

module.exports = router;