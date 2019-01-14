const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');


//Todo.remove -> Pass in a query and it removes all matching documents

//Todo.remove({}) -> deletes everything

Todo.remove({})
    .then(res => console.log(res))
    .catch(err => console.log("Error", err));

//Todo.findOneAndRemove -> Removes the first document that matches the query
//Todo.findByIdAndRemove -> Just like findOneAndRemove but looks for a match with the id provided
//Both these functions return the document that was removed

// Todo.findByIdAndRemove("5c3d0d5d99f601f41f363414")
//     .then(res => console.log(JSON.stringify(res,undefined,2)))
//     .catch(err => console.log("Error:", err));