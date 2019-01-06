const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=> {
    if (err) {
        return console.log('Unable to connect to MongoDB');
    } 
    console.log('Connected to MongoDB server');
    db.collection('Todos')
        .findOneAndUpdate({text : "Eat Lunch"},
        {$set:{
            completed: true
            }
        },{
            returnOriginal : false
        })
        .then(result => console.log(JSON.stringify(result, undefined, 2)));
    //db.close();
});