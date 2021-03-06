const express = require('express');
const auth = require('../middlewares/auth');

var chatRouter = express.Router();

chatRouter.route('/')
    .get(auth);

chatRouter.route('/chat.html')
    .get(auth);

module.exports = chatRouter;