const User = require('../models/User');
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app"); // import your express app

chai.should();
chai.use(chaiHttp);

// keep track of the created user ids
let createdUserIds = [];
describe("/users routes", () => {
    describe("POST /users/register", () => {
        /* before(function() {
            server.listen(3000, function () {
                console.log('Server is listening before tests run');
            });
        }); */
        
        afterEach(async () => {
            // Teardown: delete the created user
            try {
                if (createdUserIds.length > 0) {
                    for (let i = 0; i < createdUserIds.length; i++) {
                        const id = createdUserIds[i];
                        const user = await User.findByPk(id); // find the user by PK
                        //console.dir(user);
                        if (user) {
                            await user.destroy(); // delete the user
                        }
                    }
                    createdUserIds = []; // empty the array
                }
            } catch (err) {
                console.log(err); // log any error
            }
        });
        
        it("It should register a new user", (done) => {
            const user = {
                email: "testemai123@test.com",
                password: "testPassword",
                // include all other required fields
            };
            //console.dir(user, {depht: null});
            
            chai.request(server)
            .post("/users/register")
            .send(user)
            .end((err, response) => {
                
                //console.log("RESPONSE BODY: ", response.body);
                //console.log("RESPONSE STATUS: ", response.status)
                
                response.should.have.status(201);
                response.body.should.be.a("object");
                response.body.should.have.property("id");
                response.body.should.have.property("email");
                // store the id of the created user
                createdUserIds.push(response.body.id);
                done();
            });
        });
        
        it("It should NOT register a new user without email field", (done) => {
            const user = {
                password: "testPassword",
                // exclude email
            };
            
            chai.request(server)
            .post("/users/register")
            .send(user)
            .end((err, response) => {
                response.should.have.status(400);
                response.text.should.include("Email is required");
                done();
            });
        });
        
        it("It should NOT register a new user without password field", (done) => {
            const user = {
                email: "email@example123.com",
                // exclude email
            };
            
            chai.request(server)
            .post("/users/register")
            .send(user)
            .end((err, response) => {
                response.should.have.status(400);
                response.text.should.include("Password is required");
                done();
            });
        });
        
        it("It should NOT register a new user if email is shorter than 6", (done) => {
            const user = {
                email: "e@e.c",
                password: "123456"
            };
            
            chai.request(server)
            .post("/users/register")
            .send(user)
            .end((err, response) => {
                response.should.have.status(400);
                response.text.should.include("Email should have a minimum length of 6");
                done();
            });
        });
        
        it("It should NOT register a new user if password is shorter than 6", (done) => {
            const user = {
                email: "email@example123.com",
                password: "12345"
            };
            
            chai.request(server)
            .post("/users/register")
            .send(user)
            .end((err, response) => {
                response.should.have.status(400); 
                response.text.should.include("Password should have a minimum length of 6");
                done();
            });
        });
        
        /*   after(function() {
            server.close();
            console.log('Server has stopped listening after tests');
        }); */
        
    });

    describe('POST users/login', () => {
        it('logs in an existing user', (done) => {
            const user = {
                email: 'testuser@example.com',
                password: 'password'
            };
            chai.request(server)
            .post('/users/login')
            .send(user)
            .end((err, response) => {
                response.should.have.status(200);
                response.text.should.include('logged in');
                done();
            })
        })
    })
})
    
    