const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,   //verifies that the property does not have the same value in another document
        validate:{
            validator: validator.isEmail,
            message: `{VALUE} is not a valid email.`
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {    
            type: String,
            required: true
        }
    }]
});

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    return _.pick(userObject, ["_id","email"]);
}

userSchema.methods.generateAuthToken = function() {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id:user._id.toHexString(), access},'abc123').toString();
    
    user.tokens = user.tokens.concat([{ access, token }]);
    return user.save().then(() => {
        return token;
    });
};

const User = mongoose.model('User', userSchema);


module.exports = {User};