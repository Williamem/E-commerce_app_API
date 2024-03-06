const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { User, Order, OrderItems, CartItem } = require("../models/index");

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
const nonExistentProduct = { id: 9999 };
let createdOrderIds = [];

describe.skip("/cart", () => {
  afterEach((done) => {
    CartItem.destroy({ where: { user_id: testUserId } }).then(() => {
      done();
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
      describe("post when item is already in cart", () => {
        //create an item in the cart to add to in the test case
        before((done) => {
          agent
            .post("/cart/add")
            .send({ item_id: testProductToAddTo.id, quantity: 2 })
            .end((err, res) => {
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
    });
    describe("GET /cart as regular user", () => {
      //create an item in the cart to add to in the test case
      before((done) => {
        agent
          .post("/cart/add")
          .send({ item_id: testProductToAddTo.id, quantity: 2 })
          .end((err, res) => {
            done(err);
          });
      });
      it("it should get the user's cart", (done) => {
        agent.get("/cart").end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done(err);
        });
      });
      it("it should return a message if the cart is empty", (done) => {
        agent.get("/cart").end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.message.should.equal("Cart is empty");
          done(err);
        });
      });
    });

    describe("DELETE /cart/:id as regular user", () => {
      before((done) => {
        agent
          .post("/cart/add")
          .send({ item_id: testProductToAddTo.id, quantity: 2 })
          .end((err, res) => {
            done(err);
          });
      });
      it("deletes an item from the cart", (done) => {
        agent.delete(`/cart/${testProductToAddTo.id}`).end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.message.should.equal("Item removed from cart");
          done(err);
        });
      });
      it("returns a message if the item is not in the cart", (done) => {
        agent.delete(`/cart/${nonExistentProduct.id}`).end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.message.should.equal("Item not found in cart");
          done(err);
        });
      });
    });
    describe("DELETE /cart as regular user", () => {
      before((done) => {
        agent
          .post("/cart/add")
          .send({ item_id: testProductToAddTo.id, quantity: 2 })
          .end((err, res) => {
            done(err);
          });
      });
      it("deletes all items from the cart", (done) => {
        agent.delete("/cart").end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.message.should.equal("Cart cleared");
          done(err);
        });
      });
    });

    describe("PUT /cart/:id as regular user", () => {
      before((done) => {
        agent
          .post("/cart/add")
          .send({ item_id: testProductToAddTo.id, quantity: 2 })
          .end((err, res) => {
            done(err);
          });
      });
      it("updates the quantity of an item in the cart", (done) => {
        agent
          .put(`/cart/${testProductToAddTo.id}`)
          .send({ quantity: 4 })
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
      it("returns a message if the item is not in the cart", (done) => {
        agent
          .put(`/cart/${nonExistentProduct.id}`)
          .send({ quantity: 4 })
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            res.body.message.should.equal("Item not found in cart");
            done(err);
          });
      });
    });

    describe("POST /cart/checkout as regular user", () => {
      before(() => {
        // Return the promise chain
        return (
          agent
            .post("/cart/add")
            .send({ item_id: testProductToAddTo.id, quantity: 4 })
            // Use .then to chain the next action
            .then((res) => {
              return agent
                .post("/cart/add")
                .send({ item_id: testProductToAddTo.id, quantity: 5 });
            })
            // Catch any error in the chain
            .catch((err) => {
              // Optionally throw the error to fail the test
              throw new Error("Setup failed");
            })
        );
      });
      it("should checkout successfully", (done) => {
        agent.post("/cart/checkout").end(async (err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal("Checkout successful");

          // Verify the order
          const order = await Order.findOne({ where: { user_id: testUserId } });
          order.should.exist;

          createdOrderIds.push(order.id);

          // Verify the order items
          const orderItem = await OrderItems.findOne({
            where: { order_id: order.id },
          });
          orderItem.should.exist;

          // Verify the cart is empty
          /* const cartItem = await CartItem.findOne({
            where: { user_id: testUserId },
          });
          should.not.exist(cartItem); */

          FIXME: done();
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
    after(async () => {
      if (createdOrderIds.length > 0) {
        for (let i = 0; i < createdOrderIds.length; i++) {
          const id = createdOrderIds[i];
          const order = await Order.findOne({
            where: { id: id },
          });
          const orderItems = await OrderItems.findAll({
            where: { order_id: id },
          });
          if (orderItems) {
            for (let i = 0; i < orderItems.length; i++) {
                await orderItems[i].destroy();
            }
          }
          if (order) {
            await order.destroy();
          }
        }
      }
      createdOrderIds = [];
    });
  });
  describe("/cart as guest", () => {
    describe("GET /cart as guest", () => {
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
  });
  describe("POST /cart as guest", () => {
    it("it should not allow a guest to add an item to the cart", (done) => {
      chai
        .request(server)
        .post("/cart/add")
        .send({ item_id: testProduct.id, quantity: 2 })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.message.should.equal("Please log in to use the cart");
          done(err);
        });
    });
  });
  describe("DELETE /cart/:id as guest", () => {
    it("it should not allow a guest to remove an item from the cart", (done) => {
      chai
        .request(server)
        .delete(`/cart/${testProduct.id}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.message.should.equal("Please log in to use the cart");
          done(err);
        });
    });
  });

  describe("DELETE /cart as guest", () => {
    it("it should not allow a guest to clear the cart", (done) => {
      chai
        .request(server)
        .delete("/cart")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.message.should.equal("Please log in to use the cart");
          done(err);
        });
    });
  });

  describe("PUT /cart/:id as guest", () => {
    it("it should not allow a guest to update an item in the cart", (done) => {
      chai
        .request(server)
        .put(`/cart/${testProduct.id}`)
        .send({ quantity: 4 })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.message.should.equal("Please log in to use the cart");
          done(err);
        });
    });
  });
  describe("POST /cart/checkout as guest", () => {
    it("should not allow a guest to checkout", (done) => {
      chai
        .request(server)
        .post("/cart/checkout")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal("Please log in to use the cart");
          done(err);
        });
    });
  });
});
