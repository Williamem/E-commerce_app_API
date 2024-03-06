const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { User, Order, OrderItems } = require("../models/index");

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

const testUser2 = {
  email: "user_for_testing2@example.com,",
  password: "password",
};
let testUser2Id;
(async () => {
  testUserId = await findId(testUser2);
})();

let createdOrderIds = [];

describe.skip("/orders", () => {
  describe("/orders as signed in user", () => {
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
    after((done) => {
      // teardown log out user
      agent.get("/users/logout").end((err, res) => {
        done(err);
      });
    });
    describe("/orders as signed in user without order history", () => {
      describe("GET /orders", () => {
        it("it should return no orders found no orders are placed", (done) => {
          agent.get("/orders").end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("No orders found");
            done(err);
          });
        });
      });
    });
    describe("/orders with order history", () => {
      // setup order history
      before((done) => {
        agent
          .post("/cart/add")
          .send({ item_id: 1, quantity: 1 })
          .then((res) => {
            return agent.post("/cart/checkout").send( {address_id: 11 });
          })
          .then((res) => {
            console.log("res.body: ", res.body);
            createdOrderIds.push(res.body.newOrder.id);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      // teardown order history
      after((done) => {
        if (createdOrderIds.length > 0) {
          const deletePromises = createdOrderIds.map((orderId) => {
            return OrderItems.destroy({ where: { order_id: orderId } }).then(
              () => {
                return Order.destroy({ where: { id: orderId } });
              }
            );
          });

          Promise.all(deletePromises)
            .then(() => {
              createdOrderIds = [];
              done();
            })
            .catch((err) => {
              done(err);
            });
        } else {
          done();
        }
      });
      describe("/orders as signed in user with order history", () => {
        describe("GET /orders", () => {
          it("it should return an array of orders", (done) => {
            agent.get("/orders").end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.length.should.be.eql(createdOrderIds.length);
              done(err);
            });
          });
        });
        describe("GET /orders/:id when id is user.id", () => {
          it("it should return an order by id", (done) => {
            agent.get(`/orders/${createdOrderIds[0]}`).end((err, res) => {
              console.log("createdOrderIds: ", createdOrderIds[0]);
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.have.property("id").eql(createdOrderIds[0]);
              done(err);
            });
          });
        });
      });
    });
  });
  describe("/orders as guest", () => {
    describe("GET /orders", () => {
      it("it should return unauthorized", (done) => {
        chai
          .request(server)
          .get("/orders")
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("Please log in to view your orders");
            done(err);
          });
      });
    });
    describe("GET /orders/:id", () => {
      it("it should return unauthorized", (done) => {
        chai
          .request(server)
          .get("/orders/1")
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("Please log in to view your orders");
            done(err);
          });
      });
    });
  });
});
