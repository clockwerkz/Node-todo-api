const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
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

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    return _.pick(userObject, ["_id","email"]);
}

UserSchema.methods.generateAuthToken = function() {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id:user._id.toHexString(), access},'abc123').toString();
    
    user.tokens = user.tokens.concat([{ access, token }]);
    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.loginCheck = function({email, password}) {
    User.findOne({email}, (err, res) => {
        if (err) {
            return Promise.reject(err);
        }
        if (res) {
            bcrypt.compare(password, res.password, (err, res)=> {
                if(res) {
                    console.log('Login Successful');
                } else {
                    console.log('Email and/or Password not correct');
                }
            });
        }
    })
}

UserSchema.statics.findByToken = function(token) {
    const User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
 
        return Promise.reject();
    }
    
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

UserSchema.pre('save', function (next){
    if (this.isModified('password')) {
        //user.password
        //user.password = hash;
        bcrypt.genSalt(10, (err,salt) => {
           bcrypt.hash(this.password, salt, (err, hash)=> {
                this.password = hash;
                next();
           }); 
        })
    } else {
        next();
    }
});


const User = mongoose.model('User', UserSchema);


module.exports = {User};