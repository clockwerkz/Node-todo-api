const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=> {
    if (err) {
        return console.log('Unable to connect to MongoDB');
    } 
    console.log('Connected to MongoDB server');

    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log("Unable to connect to Collection: ", err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    })

    //Insert new doc into Users (name, age, location)
    db.collection('Users').insertOne({
        name: 'Carlos',
        age: 44,
        location: 'Irvine, CA'
    }, (err, result)=> {
        if (err) {
            return console.log('Unable to connect to collection: ', err);
        }
        const date = result.ops[0]._id.getTimestamp();
        console.log(date);
    })

    db.close();
});