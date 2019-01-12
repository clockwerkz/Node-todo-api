const mongoose = require('mongoose');

mongoose.Promise = global.Promise; //sets Promises to be JS Promise handling

mongoose.connect(process.env.MONGGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports.mongoose = {mongoose}