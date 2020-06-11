var express = require('express');
var User = require('../models/User');

var usersRoute = express.Router();

usersRoute.route('/users')
    .post(async (req, res) => {
        var { username, password, email } = req.body;

        try {
            var user = new User({ username, password, email });

            await user.save();

            res.status(200).send(user);
        } catch (e) {
            res.status(400).send(e);
        }
    });

module.exports = usersRoute;