require('./config/config');
const _ = require('lodash');
const {mongoose} = require('./db/mongoose.js');
const { ObjectID } = require('mongodb');
const {Todo} = require('./models/todo.js');
const {User} = require('./models/user.js');
const {authenticate} = require('./middleware/authenticate');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json()); //sets up bodyParser as middlewear

app.post('/todos', (req, res)=> {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then( doc => res.send(doc))
    .catch(err => {
        res.status(400)
        .send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find()
    .then(todos => res.send({ todos }))
    .catch(err => {
        res.status(400)
        .send(err);
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

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id))  {
        res.status(404).send();
    }

    Todo.findByIdAndRemove(id) 
        .then(todo => {
            if (todo) {
                res.status(200)
                .send({todo});
            } else {
                res.status(404).send();       
            }
        })
        .catch(err => res.status(400).send());
    // remove TodoById()
    // success - check if a doc came back.
    // if no doc, send 404
    // if doc, send 200
    // error - 400 with an empty body
});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    //Checks id to see if it's a valid ObjectID
    if (!ObjectID.isValid(id))  {
        res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
        .then(todo => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send({todo});
        })
        .catch(err => console.log("Error:",err));

})

/*** USERS ***/

app.post('/users', (req, res)=> {
    const body = _.pick(req.body, ['email','password']);
    const user = new User(body);
    user.save().then(() => {
            return user.generateAuthToken();
        })
        .then(token => res.header('x-auth', token).send(user))
        .catch(err => {
            res.status(400)
            .send(err);
        });
});

app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body).then(user => {
        console.log(user);
        res.send(user);
    })
    .catch(err => {
        res.status(403)
        .send(err);

    });
});

app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user)
});

app.listen(port, ()=> {
    console.log(`Started on port ${port}`);
});


module.exports = { app };