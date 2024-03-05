const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
/* const User = require("../models/User");
const Order = require("../models/Order");
const OrderItems = require("../models/OrderItems"); */
const { User, Order, OrderItems } = require("../models/index_old");

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

let createdOrderIds = [];

describe("/orders", () => {
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
        it("it should return an empty array when no orders are placed", (done) => {
          agent.get("/orders").end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body.length.should.be.eql(0);
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
            return agent.post("/cart/checkout");
          })
          .then((res) => {
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
            return OrderItems.destroy({ where: { order_id: orderId } })
              .then(() => {
                return Order.destroy({ where: { id: orderId } });
              });
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
});
