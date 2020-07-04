var mongoose = require('mongoose');
var validator = require('validator');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

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
        required: true,
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
    },
    tokens: [
        {
            token: { 
                type: String,
                required: true
            }
        }
    ]
});

userSchema.plugin(uniqueValidator);

userSchema.statics.findOneByCredentials = async function(email, password) {
    var user = await User.findOne({ email });

    if (!user) throw new Error('Unable to login.');

    var match = await bcrypt.compare(password, user.password);

    if (!match) throw new Error('Unable to login.');
    
    return user;
}

userSchema.methods.generateAuthToken = async function() {
    var user = this;
    var token = jwt.sign({ _id: user._id.toString() }, "MYSECRETKEY");
    
    user.tokens = user.tokens.concat({ token });

    await user.save();

    return token;
}

userSchema.pre('save', async function(next) {
    const user = this;
    
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    
    next();
});

var User = mongoose.model('User', userSchema);

module.exports = User;