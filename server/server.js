const {mongoose} = require('./db/mongoose.js');
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

app.listen(3000, ()=> {
    console.log('Started on port 3000');
});


module.exports = { app };