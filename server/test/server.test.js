const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text:'First test todo'
},{
    _id: new ObjectID(),
    text:'Second test todo'
}]


beforeEach((done)=> {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);
        }).then(()=> done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done)=> {
        const text = 'Test todo text';

    request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res)=>{
            if (err) {
               return done(err); 
            }
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch(err => done(err));
        });
    });

    it('should not create Todo with invalid body date', (done)=> {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                })
                .catch(err => done(err));
        });
    }); 
});

describe('GET /todos', () => {
    it('should get all Todos', (done)=> {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=> {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });  
});

describe('GET /todos/:id', ()=> {
    
    it('should get the Todo with the matching id provided', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toEqual(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        const testID = new ObjectID();
        request(app)
        .get(`/todos/${testID.toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if invalid ID is provided', (done) => {
        request(app)
        .get(`/todos/405dwsdew`)
        .expect(404)
        .end(done);
    })
});

describe('DELETE /todos/:id', () => {
    it('should delete a matching Todo with the matching id provided', (done) => {
        const hexID = todos[1]._id.toHexString();
        console.log(hexID);
        request(app)
        .delete(`/todos/${hexID}`)
        .expect(200)
        .expect(res => expect(res.body.todo._id).toBe(hexID))
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            //toNotExist
            Todo.findById(hexID).then((todo)=> {
                expect(todo).toNotExist();
                done();
            })
            .catch(err => console.log(err));
        });
    });

    it('should return 404 if Todo not found', (done) => {
        const testID = new ObjectID();
        request(app)
        .delete(`/todos/${testID.toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if objectID is invalid', (done) => {
        request(app)
        .delete(`/todos/405dwsdew`)
        .expect(404)
        .end(done);
    })

});

describe('PATCH /todos/:id', () => {
    it('should update an existing document with the matching id', done => {
        const hexID = todos[1]._id.toHexString();
        const text = "This is a new text field";
        request(app)
        .patch(`/todos/${hexID}`)
        .send({ text })
        .expect(res => {
            expect(res.body.todo.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            done();
        });
    });
});