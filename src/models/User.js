var mongoose = require('mongoose');
var validator = require('validator');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlenght: 8
    },
    password: {
        type: String,
        require: true,
        minlength: 8
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: email => validator.isEmail(email),
            message: props => 'Please insert a valid email.'
        }
    }
});

var User = mongoose.model('User', userSchema);

module.exports = User;