const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, "MYSECRETKEY");
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) throw new Error();

        req.token = token;
        req.user = user;

        next();
    } catch (e) {
        res.redirect('/login.html');
    }
}

module.exports = auth;