const { User, Address } = require("../models/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

chai.should();
chai.use(chaiHttp);

let createdAddressIds = [];
let createdUserIds = [];
const testUser = {
  email: "test_user_profile@test.com",
  password: "password",
};
const validAddress = {
  first_name: "First",
  last_name: "Last",
  phone: "123456789",
  country: "Country",
  state: "State",
  city: "City",
  address: "Address",
};
const updatedAddress = {
  first_name: "Updated First",
  last_name: "Updated Last",
  phone: "987654321",
  country: "Updated Country",
  state: "Updated State",
  city: "Updated City",
  address: "Updated Address",
};
describe("/profile/", () => {
  // teardown, delete any created addresses
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
        createdAddressIds = [];
      }
    } catch (err) {
      console.log(err);
    }
  });
  // teardown, delete any created users
  after(async () => {
    try {
      if (createdUserIds.length > 0) {
        for (let i = 0; i < createdUserIds.length; i++) {
          const id = createdUserIds[i];
          User.destroy({ where: { id } });
        }
        createdUserIds = [];
      }
    } catch (err) {
      console.log(err);
    }
  });
  describe("/profile/ as regular user", () => {
    //setup create a test user and sign in
    let agent;
    before((done) => {
      agent = chai.request.agent(server);
      agent
        .post("/users/register")
        .send(testUser)
        .end((err, response) => {
          createdUserIds.push(response.body.id);
          if (err) {
            return done(err);
          }
          agent
            .post("/users/login")
            .send(testUser)
            .end((err, response) => {
              if (err) {
                return done(err);
              }
              done();
            });
        });
    });
    //Teardown log out user
    after((done) => {
      agent.get("/users/logout").end((err, response) => {
        if (err) {
          return done(err);
        }
        done();
      });
    });

    //tests
    describe("POST /profile/address", () => {
      it("adds a new address for a user who is signed in", (done) => {
        agent
          .post("/profile/address")
          .send(validAddress)
          .end((err, response) => {
            response.should.have.status(201);
            response.should.be.a("object");
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
    });
    describe("GET /profile/", () => {
      it("gets the addresses and email for the user who is signed in", (done) => {
        agent.get("/profile/").end((err, response) => {
          response.should.have.status(200);
          response.should.be.a("object");
          response.body.should.have.property("addresses");
          response.body.addresses.should.be.a("array");
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
    describe("PUT /profile/address/:addressId", () => {
      it("updates an address for a user who is signed in", (done) => {
        agent
          .put(`/profile/address/${createdAddressIds[0]}`)
          .send(updatedAddress)
          .end((err, response) => {
            response.should.have.status(200);
            response.should.be.a("object");
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
  });
});
