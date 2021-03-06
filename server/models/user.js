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
    const token = jwt.sign({_id:user._id.toHexString(), access},process.env.JWT_SECRET).toString();
    
    user.tokens = user.tokens.concat([{ access, token }]);
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function(token) {
    return this.update({
        $pull: {
            tokens: {
                token
            }
        }
    });
}


UserSchema.statics.findByCredentials = function(email, password) {
    return this.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res)=> {
                if (res) {
                    resolve(user);
                } else {
                    reject('Username and/or password incorrect');
                }
            });
        });
        
    });
}

UserSchema.statics.findByToken = function(token) {
    const User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
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