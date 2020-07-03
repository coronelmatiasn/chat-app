var mongoose = require('mongoose');
var validator = require('validator');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');

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
        unique: true,
        validate: {
            validator: email => validator.isEmail(email),
            message: props => 'Please insert a valid email.'
        }
    }
});

userSchema.plugin(uniqueValidator);

userSchema.pre('save', async function(next) {
    const user = this;
    
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    
    next();
});

var User = mongoose.model('User', userSchema);

module.exports = User;