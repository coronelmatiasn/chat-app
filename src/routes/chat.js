const express = require('express');
const auth = require('../middlewares/auth');

var chatRouter = express.Router();

chatRouter.route('/chat.html')
    .get(auth);

module.exports = chatRouter;