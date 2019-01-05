const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=> {
    if (err) {
        return console.log('Unable to connect to MongoDB');
    } 
    console.log('Connected to MongoDB server');

    // db.collection('Todos')
    //     .find({ 
    //         _id : ObjectID("5c304383f0494c1c182d0ed0")
    //     })
    //     .toArray()
    //     .then(data => {
    //         console.log('Todos');
    //         console.log(JSON.stringify(data, undefined, 2));
    //     })
    //     .catch(err => console.log('Unable to fetch Collection',err));

    // db.collection('Users')
    //     .find()
    //     .count()
    //     .then((count)=> {
    //         console.log("The total number of users:", count);
    //     })
    //     .catch(err => console.log('Unable to fetch Collection',err));

    db.collection('Users')
        .find({ name : 'Carlos' })
        .toArray()
        .then(data => console.log(JSON.stringify(data, undefined, 2)))
        .catch(err => console.log('Unable to fetch Collection',err));
    //db.close();
});