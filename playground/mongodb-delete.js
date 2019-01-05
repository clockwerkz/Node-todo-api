const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=> {
    if (err) {
        return console.log('Unable to connect to MongoDB');
    } 
    console.log('Connected to MongoDB server');

    //Delete Many
    // db.collection('Todos')
    //     .deleteMany({ text: 'Eat Lunch' })
    //     .then(data => console.log(JSON.stringify(data, undefined, 2)))
    //     .catch(err => console.log("Unable to connect to Collection:", err));

    //Delete One
    // db.collection('Todos')
    //     .deleteOne({ text : 'Eat Brinner'})
    //     .then(data => console.log(JSON.stringify(data, undefined, 2)))
    //     .catch(err => console.log("Unable to connect to Collection:", err));

    //Find One and Delete
    db.collection('Todos')
        .findOneAndDelete({ _id : ObjectID("5c3061ffa49402c75706f332")})
        .then(data => console.log(JSON.stringify(data.value, undefined, 2)))
        .catch(err => console.log("Unable to connect to Collection:", err));

    //db.close();
});