const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=> {
    if (err) {
        return console.log('Unable to connect to MongoDB');
    } 
    console.log('Connected to MongoDB server');
    // db.collection('Todos')
    //     .findOneAndUpdate({_id: ObjectID("5c31a80e13550caa147609b0")},
    //     {$set:{
    //         completed: true
    //         }
    //     },{
    //         returnOriginal : false
    //     })
    //     .then(result => console.log(JSON.stringify(result, undefined, 2)));

    // db.collection('Users')
    //     .findOneAndUpdate(
    //         {
    //             _id: ObjectID("5c30460e72e9ba0cd8715573")
    //         },
    //         {
    //             $inc: {
    //                 age: -31
    //             }
    //         },
    //         {
    //             returnOriginal : false
    //         }
    //     )
    //     .then(results => console.log(JSON.stringify(results, undefined, 2)));

    db.collection('Users')
        .findOneAndUpdate(
            {
                _id: ObjectID("5c30464aef36a10e94a471f6")
            },{
                $set: {
                    name: 'Noah'
                },
                $inc : {
                    age : -33
                }
            },{
                returnOriginal: false
            }
        )
        .then(results => console.log(JSON.stringify(results, undefined, 2)));
    //db.close();
});