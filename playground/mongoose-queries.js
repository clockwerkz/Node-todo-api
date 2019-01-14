const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

const id = '5c3307548927c3040578886a';
const userId = `5c31b76583763c941adf4abd`;

//ObjectId.isValid;

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }
const todo = new Todo({
    text: "Adds a New Todo"
});

todo.save()
    .catch(err => {
        console.log("Error", err);
    });


Todo.find({}).then((todos) => console.log('Todos', todos));


// Todo.findOne({
//     _id: id
// }).then((todo) => console.log('Todo', todo));

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log("Id not found!");
//     }
//     console.log('Todo by Id', todo)
// }).catch((e)=> (console.log(e)));


//User find by Id;

//query user not found
//user is found
//all other errors

// if (ObjectID.isValid(userId)){
//     User.findById(userId)
//         .then(user => {
//             if (!user) {
//                 return console.log('User ID not found');
//             }
//             console.log(JSON.stringify(user),undefined, 2);
//         })
//         .catch(err => console.log("Error", err));
// } else {
//     console.log("Object ID provided is not valid");
// }


