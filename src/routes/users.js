var express = require('express');
var User = require('../models/User');

var usersRoute = express.Router();

usersRoute.route('/users')
    .post(async (req, res) => {
        var { username, password, email } = req.body;

        try {
            var user = new User({ username, password, email });

            await user.save();

            var token = await user.generateAuthToken();

            res.status(200).send({ user, token });
        } catch (e) {
            res.status(400).send(e);
        }
    });

usersRoute.route('/login')
    .post(async (req, res) => {
        var { email, password } = req.body;

        try {
            var user = await User.findOneByCredentials(email, password);

            var token = await user.generateAuthToken();

            res.send({ user, token });
        } catch (e) {
            res.status(400).send(e.message);
        }
    });

module.exports = usersRoute;