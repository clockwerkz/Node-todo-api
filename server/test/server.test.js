const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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
                    expect(todos.length).toBe(3);
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
            expect(res.body.todos.length).toBe(3);
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
    it('should update an existing document and mark it as completed', done => {
        let hexID = todos[1]._id.toHexString();
        const text = "This is a new text field";
        request(app)
        .patch(`/todos/${hexID}`)
        .send({ text, completed:true })
        .expect(200)
        .expect(res => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    it('should clear completedAt when todo is not completed', (done)=> {
        let firstHexID = todos[0]._id.toHexString();
        request(app)
        .patch(`/todos/${firstHexID}`)
        .send({ completed:false })
        .expect(200)
        .expect(res => {
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            done();
        });
        
    })
});


describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .send()
        .expect(200)
        .expect(res => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .send()
        .expect(401)
        .expect(res => {
            expect(res.body).toEqual({});
        })
        .end(done);
    })
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        const newvalidUser = {email:'test@example.com', password: '123456!'};
        request(app)
        .post('/users')
        .send(newvalidUser)
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body.email).toBe(newvalidUser.email)
            expect(res.body._id).toExist();
        })
        .end(err => {
            if (err) {
                return done(err);
            }
            User.findOne({email:newvalidUser.email})
                .then(user =>{
                    expect(user._id).toExist();
                    expect(user.password).toNotBe(newvalidUser.password);
                    done();
                }).catch((err) => done(err));
        });
    });


    it('should return validation errors if request invalid', (done) => {
        const badPassword = '123';
        request(app)
        .post('/users')
        .send({email:'newtest@test.com', password:badPassword})
        .expect(400)
        .expect(res => {
            expect(res.body._id).toNotExist();
            expect(res.body.email).toNotExist();
        })
        .end(done);
    });

    it('it should not create user if email in use', (done) => {
        const {email} = users[0];
        request(app)
        .post('/users')
        .send({email, password:'12345663'})
        .expect(400)
        .expect(res => {
            expect(res.body._id).toNotExist();
            expect(res.body.email).toNotExist();
        })
        .end(done);
    });
});

describe('POST /users/login', ()=> {
    it('should login user and return auth token', (done)=> {
        request(app)
        .post('/users/login')
        .send({
            email:users[1].email,
            password:users[1].password
        })
        .expect(200)
        .expect(res=> {
            expect(res.headers['x-auth']).toExist();
        })
        .end((err,res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[0]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch((err) => done(err));
        });
    });

    it('should reject invalid login', (done)=> {
        request(app)
        .post('/users/login')
        .send({
            email:users[1].email,
            password: '123456770'
        })
        .expect(400)
        .expect(res => {
            expect(res.headers['x-auth']).toNotExist();
        })
        .end((err,res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch(err => done(err));
        });
    });
});

describe('DELETE /users/logout', ()=> {
    it('should logout by remove the current auth token', (done)=>{
        request(app)
        .delete('/users/logout')
        .set('x-auth',users[0].tokens[0].token)
        .send()
        .expect(200)
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            User.findById(users[0]._id).then(user => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch(err=> done(err));
        });
    });
})