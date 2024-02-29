const Address = require('../models/Address');
const User = require('../models/User')
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

chai.should();
chai.use(chaiHttp);

// keep track of the created addresses
let createdAddressIds = [];
const admin = {email: 'admin@example.com', password: 'password', id: 44};
const adminId = admin.id;
const regularUser = {email: 'testuser@example.com', password: 'password', id: 32};
const regularUserId = regularUser.id;
const anotherExistingUserId = 128;
const nonexistantUserId = 9999;

const findId = (user) => {
    return (req, res, next) => {
        return req.user.dataValues.id;
    }
}


describe('/profile/:userId/address', () => {
    describe('/profile/:userId/address as admin', () => {
        //setup login admin
        let agent;
        before((done) => {
            agent = chai.request.agent(server);
            agent
                .post('/users/login')
                .send(admin)
                .end((err, response) => {
                    adminId = response.body.id;
                    done(err);
                });
        });
        //tests

        // teardown
        //delete any created addresses
        after(async () => {
            // Teardown: delete the created user
            try {
                if (createdAddressIds.length > 0) {
                    for (let i = 0; i < createdAddressIds.length; i++) {
                        const id = createdAddressIds[i];
                        const address = await Address.findByPk(id);
                        if (address) {
                            await address.destroy(); // delete the user
                        }
                    }
                    createdAddressIds = []; // empty the array
                }
            } catch (err) {
                console.log(err);
            }
        });
        //log out
        after((done) => {
            chai.request(server)
                .get('/users/logout')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });   
    });
    describe('/profile/:userId/address as regular user', () => {
        //setup login regular user
        let agent;
        before((done) => {
            agent = chai.request.agent(server);
            agent
                .post('/users/login')
                .send(regularUser)
                .end((err, response) => {
                    done(err);
                });
        });
        //tests
        describe('POST /profile/:userId/address', () => {
            const validAddress = {
                first_name: 'First',
                last_name: 'Last',
                phone: '123456789',
                country: 'Country',
                state: 'State',
                city: 'City',
                address: 'Address'
            };
            it('adds a new address for a user who is signed in', (done) => {
                agent
                    .post(`/profile/${regularUserId}/address`)
                    .send(validAddress)
                    .end((err, response) => {
                        console.log('regularUserId ', regularUserId)
                        response.should.have.status(201);
                        response.should.be.a('object');
                        response.body.should.have.property("id");
                        response.body.should.have.property("user_id");
                        response.body.should.have.property("first_name");
                        response.body.should.have.property("last_name");
                        response.body.should.have.property("phone");
                        response.body.should.have.property("country");
                        response.body.should.have.property("state");
                        response.body.should.have.property("city");
                        response.body.should.have.property("address");
                        createdAddressIds.push(response.body.id);
                        done();
                    });
            });
            it('fails to add an address to a user thats not the user logged in', (done) => {
                agent
                    .post(`/profile/${anotherExistingUserId}/address`)
                    .send(validAddress)
                    .end((err, response) => {
                        response.should.have.status(403);
                        response.text.should.include('Unauthorized');
                        done();
                    });
            });
            it('fails to add an address to a user that does not exist', (done) => {
                agent
                    .post(`/profile/${nonexistantUserId}/address`)
                    .send(validAddress)
                    .end((err, response) => {
                        response.should.have.status(404);
                        response.text.should.include('User not found');
                        done();
                    });
            });
        });
        describe('GET /profile/:userId', () => {
            it('gets the addresses and email for the user who is signed in', (done) => {
                agent
                    .get(`/profile/${regularUserId}`)
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.should.be.a('object');
                        response.body.should.have.property("email");
                        response.body.should.have.property("id");
                        response.body.should.have.property("first_name");
                        response.body.should.have.property("last_name");
                        response.body.should.have.property("phone");
                        done();
                    });
            });
            it('fails to get the addresses for a user that does not exist', (done) => {
                agent
                    .get(`/profile/${nonexistantUserId}`)
                    .end((err, response) => {
                        response.should.have.status(404);
                        response.text.should.include('User not found');
                        done();
                    });
            });
        });
        // teardown
        //delete any created addresses
        after(async () => {
            try {
                if (createdAddressIds.length > 0) {
                    for (let i = 0; i < createdAddressIds.length; i++) {
                        const id = createdAddressIds[i];
                        const address = await Address.findByPk(id);
                        if (address) {
                            await address.destroy();
                        }
                    }
                    createdAddressIds = []; // empty the array
                }
            } catch (err) {
                console.log(err);
            }
        });
        //log out
        after((done) => {
            chai.request(server)
                .get('/users/logout')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });  

    });
    describe('/profile/:userId/address as guest', () => {
        //delete any created addresses
        after(async () => {
            try {
                if (createdAddressIds.length > 0) {
                    for (let i = 0; i < createdAddressIds.length; i++) {
                        const id = createdAddressIds[i];
                        const address = await Address.findByPk(id);
                        if (address) {
                            await address.destroy();
                        }
                    }
                    createdAddressIds = []; // empty the array
                }
            } catch (err) {
                console.log(err);
            }
        });

    })
})