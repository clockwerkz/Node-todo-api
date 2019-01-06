const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');

// save new something

const Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

// const newTodo = new Todo({
//     text: 'Cook Dinner'
// });

// newTodo.save().then((doc) => { 
//     console.log('Saved todo', doc);
// })
// .catch((err) => console.log('Unable to save Todo'));

const todo2 = new Todo({
    text: 'Wash my hair',
    completed: false,
    completedAt: 123
});

todo2.save().then(doc => console.log('Save new Todo', JSON.stringify(doc, undefined, 2)))
.catch(err => console.log('unable to save todo', err));