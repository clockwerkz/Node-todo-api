const { ObjectID } = require('mongodb');
const { Todo } = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text:'First test todo',
    completed: true,
    completedAt: 333
},{
    _id: new ObjectID(),
    text:'Second test todo'
},{
    _id: new ObjectID(),
    text:'Third test todo',
    completed: true,
    completedAt: 666
}];

const populateTodos = (done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);
        }).then(()=> done());
}

module.exports = {todos, populateTodos};