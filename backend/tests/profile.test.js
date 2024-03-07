const { User, Address } = require("../models/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

chai.should();
chai.use(chaiHttp);

const findId = async (userToFind) => {
  const user = await User.findOne({ where: { email: userToFind.email } });
  return user.id;
};

// keep track of the created addresses
let createdAddressIds = [];
const admin = { email: "admin@example.com", password: "password" };
let adminId;
(async () => {
  adminId = await findId(admin);
})();
const testUser = {
  email: "user_for_testing@example.com",
  password: "password",
};
let testUserId;
(async () => {
  testUserId = await findId(testUser);
})();
const anotherExistingUserId = 128;
const nonexistantUserId = 9999;

//

describe("/profile/:userId/", () => {
  // teardown, delete any created addresses
  after(async () => {
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
  describe("/profile/:userId/ as regular user", () => {
    //setup login regular user
    let agent;
    before((done) => {
      agent = chai.request.agent(server);
      agent
        .post("/users/login")
        .send(testUser)
        .end((err, response) => {
          done(err);
        });
    });
    //tests
    describe("POST /profile/:userId/address", () => {
      const validAddress = {
        first_name: "First",
        last_name: "Last",
        phone: "123456789",
        country: "Country",
        state: "State",
        city: "City",
        address: "Address",
      };
      it("adds a new address for a user who is signed in", (done) => {
        agent
          .post("/profile/address")
          .send(validAddress)
          .end((err, response) => {
            console.log("testUserId ", testUserId);
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
        const updatedAddress = {
          first_name: "Updated First",
          last_name: "Updated Last",
          phone: "987654321",
          country: "Updated Country",
          state: "Updated State",
          city: "Updated City",
          address: "Updated Address",
        };
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
      chai
        .request(server)
        .get("/users/logout")
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});
