const { User, Address } = require('../models/index');
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

chai.should();
chai.use(chaiHttp);

const findId = async (userToFind) => {
        const user = await User.findOne({where: {email: userToFind.email}});
        return user.id;
}

// keep track of the created addresses
let createdAddressIds = [];
const admin = {email: 'admin@example.com', password: 'password'};
let adminId;
(async () => {
  adminId = await findId(admin);
})();
const testUser = {email: 'user_for_testing@example.com', password: 'password'};
let testUserId;
(async () => {
  testUserId = await findId(testUser);
})();
const anotherExistingUserId = 128;
const nonexistantUserId = 9999;

//




describe('/profile/:userId/', () => {

    describe('/profile/:userId/ as admin', () => {
        //setup login admin
        let agent;
        before((done) => {
            agent = chai.request.agent(server);
            agent
                .post('/users/login')
                .send(admin)
                .end((err, response) => {
                    done(err);
                });
        });
        //tests        
        //admin can view any user's profile
        describe('POST /profile/:userId/address as admin', () => {
            const validAddress = {
                first_name: 'First',
                last_name: 'Last',
                phone: '123456789',
                country: 'Country',
                state: 'State',
                city: 'City',
                address: 'Address'
            };
            it('adds a new address for any user when signed in as admin', (done) => {
                agent
                    .post(`/profile/${testUserId}/address`)
                    .send(validAddress)
                    .end((err, response) => {
                        console.log('testUserId ', testUserId)
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


        describe('GET /profile/:userId as admin', () => {
            it('gets the addresses and email for any user when signed in as admin', (done) => {
                agent
                    .get(`/profile/${testUserId}`)
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.should.be.a('object');
                        response.body.should.have.property("addresses");
                        response.body.addresses.should.be.a('array');
                        response.body.addresses[0].should.have.property("user_id");
                        response.body.addresses[0].should.have.property("first_name");
                        response.body.addresses[0].should.have.property("last_name");
                        response.body.addresses[0].should.have.property("phone");
                        response.body.addresses[0].should.have.property("country");
                        response.body.addresses[0].should.have.property("state");
                        response.body.addresses[0].should.have.property("city");
                        response.body.addresses[0].should.have.property("address");
                        done();
                    });
            });
            it('gets User not found for a user that does not exist', (done) => {
                agent
                    .get(`/profile/${nonexistantUserId}`)
                    .end((err, response) => {
                        response.should.have.status(404);
                        response.text.should.include('User not found');
                        done();
                    });
            });
        });
        describe('PUT /profile/:userId/address/:addressId as admin', () => {
            it('updates an address for any user when signed in as admin', (done) => {
                const updatedAddress = {
                    first_name: 'Updated First',
                    last_name: 'Updated Last',
                    phone: '987654321',
                    country: 'Updated Country',
                    state: 'Updated State',
                    city: 'Updated City',
                    address: 'Updated Address'
                };
                agent
                    .put(`/profile/${testUserId}/address/${createdAddressIds[0]}`)
                    .send(updatedAddress)
                    .end((err, response) => {
                        response.should.have.status(200);
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
                        done();
                    });
            });
        });

        // teardown
        //delete any created addresses
        after(async () => {
            // Teardown: delete the created address
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
    describe('/profile/:userId/ as regular user', () => {
        //setup login regular user
        let agent;
        before((done) => {
            agent = chai.request.agent(server);
            agent
                .post('/users/login')
                .send(testUser)
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
                    .post(`/profile/${testUserId}/address`)
                    .send(validAddress)
                    .end((err, response) => {
                        console.log('testUserId ', testUserId)
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
        });
        describe('GET /profile/:userId', () => {
            it('gets the addresses and email for the user who is signed in', (done) => {
                agent
                    .get(`/profile/${testUserId}`)
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.should.be.a('object');
                        //the following properties are on objects in an array, rewrite the assertions for me.
                        response.body.should.have.property("addresses");
                        response.body.addresses.should.be.a('array');
                        response.body.addresses[0].should.have.property("user_id");
                        response.body.addresses[0].should.have.property("first_name");
                        response.body.addresses[0].should.have.property("last_name");
                        response.body.addresses[0].should.have.property("phone");
                        response.body.addresses[0].should.have.property("country");
                        response.body.addresses[0].should.have.property("state");
                        response.body.addresses[0].should.have.property("city");
                        response.body.addresses[0].should.have.property("address");
                        done();
                    });
            });
        });
        describe('PUT /profile/:userId/address/:addressId', () => {
            it('updates an address for a user who is signed in', (done) => {
                const updatedAddress = {
                    first_name: 'Updated First',
                    last_name: 'Updated Last',
                    phone: '987654321',
                    country: 'Updated Country',
                    state: 'Updated State',
                    city: 'Updated City',
                    address: 'Updated Address'
                };
                agent
                    .put(`/profile/${testUserId}/address/${createdAddressIds[0]}`)
                    .send(updatedAddress)
                    .end((err, response) => {
                        response.should.have.status(200);
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
    describe('/profile/:userId/ as guest', () => {
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