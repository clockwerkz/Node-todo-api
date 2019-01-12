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

    it('should get all Todos', (done)=> {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=> {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });  
    
    it('should get the Todo with the matching id provided', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toEqual(todos[0]._id);
        })
        .end(done);
    })
});