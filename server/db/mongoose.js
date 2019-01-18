const mongoose = require('mongoose');

mongoose.Promise = global.Promise; //sets Promises to be JS Promise handling

mongoose.connect(process.env.MONGODB_URI);

module.exports.mongoose = {mongoose}