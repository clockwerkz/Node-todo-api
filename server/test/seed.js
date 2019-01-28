const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const todos = [{
    _id: new ObjectID(),
    text:'First test todo',
    completed: true,
    completedAt: 333,
    _creator: userOneId
},{
    _id: new ObjectID(),
    text:'Second test todo',
    _creator: userTwoId
}];

const users = [
    {
        _id:userOneId,
        email: 'carlos@example.com',
        password: 'userOnePass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id:userOneId.toHexString(), access: 'auth'},'abc123').toString()
        }]
    }, {
        _id:userTwoId,
        email: 'tom@example.com',
        password: 'userTwoPass'
    }];

const populateTodos = (done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);
        }).then(()=> done());
}

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            const userOne = new User(users[0]).save();
            const userTwo = new User(users[1]).save();

            return Promise.all([userOne, userTwo])
        }).then(() => done());
}

module.exports = {todos, populateTodos, users, populateUsers};