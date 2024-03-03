const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const User = require("../models/User");
const Product = require("../models/Product");
const CartItem = require("../models/CartItem");

chai.should();
chai.use(chaiHttp);

const findId = async (userToFind) => {
  const user = await User.findOne({ where: { email: userToFind.email } });
  return user.id;
};

const testUser = {
  email: "user_for_testing@example.com",
  password: "password",
};
let testUserId;
(async () => {
  testUserId = await findId(testUser);
})();
const testProduct = { id: 7 };
const testProductToAddTo = { id: 1 };

describe("Cart", () => {
  describe("/cart as admin", () => {
    // Setup log in admin
    let agent;
    before((done) => {
      agent = chai.request.agent(server);
      agent
        .post("/users/login")
        .send({ email: "admin@example.com", password: "password" })
        .end((err, res) => {
          done(err);
        });
    });

    // teardown, log out admin
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
  describe("/cart as regular user", () => {
    // Setup log in regular user
    let agent;
    before((done) => {
      agent = chai.request.agent(server);
      agent
        .post("/users/login")
        .send(testUser)
        .end((err, res) => {
          done(err);
        });
    });
    //create an item in the cart to add to in the test case
    before((done) => {
      agent
        .post("/cart/add")
        .send({ item_id: testProductToAddTo.id, quantity: 2 })
        .end((err, res) => {
          done(err);
        });
    });
    //tests:
    describe("POST /cart as regular user", () => {
      it("it should add an item to the cart", (done) => {
        agent
          .post("/cart/add")
          .send({ item_id: testProduct.id, quantity: 2 })
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a("object");
            res.body.should.have.property("item_id");
            res.body.should.have.property("quantity");
            res.body.should.have.property("user_id");
            done(err);
          });
      });
      it("should update the quantity of an item already in the cart", (done) => {
        agent
          .post("/cart/add")
          .send({ item_id: testProductToAddTo.id, quantity: 2 })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("item_id");
            res.body.should.have.property("quantity");
            res.body.should.have.property("user_id");
            res.body.quantity.should.equal(4);
            done(err);
          });
      });
    });

    // teardown, log out regular user
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
  describe.skip("/cart as guest", () => {
    it("it should not allow a guest to access the cart", (done) => {
      chai
        .request(server)
        .get("/cart")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.message.should.equal("Please log in to use the cart");
          done(err);
        });
    });
  });
  after((done) => {
    CartItem.destroy({ where: { user_id: testUserId } }).then(() => {
      done();
    });
  });
});
