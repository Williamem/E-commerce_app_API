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
  email: "test_user_order@test.com",
  password: "password",
};
let createdOrderIds = [];
let createdUserIds = [];

describe("/orders", () => {
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
  describe("/orders as user", () => {
    //setup create and sign in user
    let agent;
    before((done) => {
      agent = chai.request.agent(server);
      agent
        .post("/users/register")
        .send(testUser)
        .then((res) => {
          createdUserIds.push(res.body.id);
          return agent.post("/users/login").send(testUser);
        })
        .then(() => {
          done();
        })
        .catch(done);
    });
    // teardown log out user and delete user
    after((done) => {
      agent.get("/users/logout").end((err, res) => {
        User.destroy({ where: { id: createdUserIds[0] } }).then(() => {
          createdUserIds = [];
          done(err);
        });
      });
    });
    describe("GET /orders with no orders placed", () => {
      it("it should return no orders found", (done) => {
        agent.get("/orders").end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("No orders found");
          done(err);
        });
      });
    });
    describe("GET /orders/:id with no orders placed", () => {
      it("it should return order not found", (done) => {
        agent.get("/orders/81").end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Order not found");
          done(err);
        });
      });
    });
    describe("GET /orders with orders placed", () => {
      before((done) => {
        agent
          .post("/cart/add")
          .send({ item_id: 1, quantity: 1 })
          .then(() => {
            return agent.post("/cart/checkout").send({ address_id: 11 });
          })
          .then((res) => {
            createdOrderIds.push(res.body.newOrder.id);
            done();
          })
          .catch(done);
      });
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
      describe("GET /orders/:id", () => {
        it("it should return an order by id", (done) => {
          agent.get(`/orders/${createdOrderIds[0]}`).end((err, res) => {
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
