const express = require('express');
const User = require('../models/User');
const auth = require('../middlewares/auth');

var usersRouter = express.Router();

usersRouter.route('/users')
    .post(async (req, res) => {
        var { username, password, email } = req.body;

        try {
            var user = new User({ username, password, email });

            await user.save();

            var token = await user.generateAuthToken();

            res.status(200).cookie('token', token, {
                maxAge: 60 * 60 * 24 * 7,
                secure: false,
                httpOnly: true
            });
        } catch (e) {
            res.status(400).send(e);
        }
    });

usersRouter.route('/login')
    .post(async (req, res) => {
        var { email, password } = req.body;

        try {
            var user = await User.findOneByCredentials(email, password);

            var token = await user.generateAuthToken();

            res.status(200).cookie('token', token, {
                maxAge: 60 * 60 * 24 * 7,
                secure: false,
                httpOnly: true
            }).redirect('/');
        } catch (e) {
            res.status(400).send(e.message);
        }
    });

module.exports = usersRouter;