const {mongoose} = require('./db/mongoose.js');
const { ObjectID } = require('mongodb');
const {Todo} = require('./models/todo.js');
const {User} = require('./models/user.js');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); //sets up bodyParser as middlewear

app.post('/todos', (req, res)=> {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then( doc => res.send(doc))
    .catch(err => {
        res.status(400);
        res.send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find()
    .then(todos => res.send({ todos }))
    .catch(err => {
        res.status(400)
        send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    } 
    Todo.findById(id)
    .then(todo => {
        if (!todo) {
            res.status(404).send();
        }
        res.send({ todo });
    })
    .catch(err => {
        res.status(400).send();
    })
});

app.listen(3000, ()=> {
    console.log('Started on port 3000');
});


module.exports = { app };