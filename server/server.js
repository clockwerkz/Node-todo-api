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

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, x-auth"
    );
    res.header('Access-Control-Expose-Headers','x-auth');
    res.header()
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });

app.post('/todos', authenticate, (req, res)=> {
    const todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then( doc => res.send(doc))
    .catch(err => {
        res.status(400)
        .send(err);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    })
    .then(todos => res.send({ todos }))
    .catch(err => {
        res.status(400)
        .send(err);
    });
});

app.get('/todos/:id',authenticate,  (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    } 
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    })
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

app.delete('/todos/:id',authenticate, async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id))  {
        res.status(404).send();
    }

    try {
        const todo = await Todo.findOneAndRemove({_id:id,_creator: req.user._id}); 
        if (todo) {
            res.status(200).send({todo});
        } else {
            res.status(404).send();       
        }
    } catch (err) {
        res.status(400).send()
    }

    // Todo.findOneAndRemove({
    //     _id:id,
    //     _creator: req.user._id
    // }) 
    //     .then(todo => {
    //         if (todo) {
    //             res.status(200)
    //             .send({todo});
    //         } else {
    //             res.status(404).send();       
    //         }
    //     })
    //     .catch(err => res.status(400).send());
    // remove TodoById()
    // success - check if a doc came back.
    // if no doc, send 404
    // if doc, send 200
    // error - 400 with an empty body
});

app.patch('/todos/:id',authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({
        _id:id,
        _creator: req.user._id    
        }, {$set: body}, {new: true})
        .then(todo => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send({todo});
        })
        .catch(err => console.log("Error:",err));

})

/*** USERS ***/

app.post('/users', async (req, res)=> {
    const body = _.pick(req.body, ['email','password']);
    const user = new User(body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (err) {
        res.status(400).send(err);    
    }
    // user.save().then(() => {
    //         return user.generateAuthToken();
    //     })
    //     .then(token => res.header('x-auth', token).send(user))
    //     .catch(err => {
    //         res.status(400)
    //         .send(err);
    //     });
});

app.post('/users/login', async (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
    } catch (err) {
        res.status(400).send(); 
    }
});

app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user)
});

app.listen(port, ()=> {
    console.log(`Started on port ${port}`);
});

app.delete('/users/logout', authenticate, async (req, res) => {
    try {
    await req.user.removeToken(req.token);
    res.status(200).send();
    } catch(err) {
        res.status(400).send();
    }
});


module.exports = { app };