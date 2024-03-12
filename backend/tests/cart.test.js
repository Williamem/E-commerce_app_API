const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const {
  User,
  Order,
  OrderItems,
  CartItem,
  Product,
} = require("../models/index");
const { or } = require("sequelize");

chai.should();
chai.use(chaiHttp);
const testUser = {
  email: "test_user_cart@test.com",
  password: "password",
};
let testUserId;

const testAddress = {
  first_name: "test",
  last_name: "user",
  phone: "123456",
  address: "test address",
  city: "test city",
  country: "test country",
};
let testAddressId;

const testProduct = { name: "test product", price: 100, stock: 10 };
let testProductId;

const nonExistentProductId = -1;
let createdOrderIds = [];
let addedCartItemsIds = [];

describe("/cart", () => {
  //Setup crate a test product for use in tests
  before((done) => {
    Product.create(testProduct).then((product) => {
      testProductId = product.id;
      done();
    });
  });
  //teardown delete the test product
  after((done) => {
    Product.destroy({ where: { id: testProductId } }).then(() => {
      done();
    });
  });
  describe("/cart as regular user", () => {
    //Setup create and sign in user
    let agent;
    before((done) => {
      agent = chai.request.agent(server);
      agent
        .post("/users/register")
        .send(testUser)
        .end((err, res) => {
          testUserId = res.body.id;
          if (err) {
            return done(err);
          }
          agent
            .post("/users/login")
            .send(testUser)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              // Add an address for the user
              agent
                .post("/users/address")
                .send({ ...testAddress, user_id: testUserId })
                .end((err, res) => {
                  testAddressId = res.body.id;
                  if (err) {
                    return done(err);
                  }
                  done();
                });
            });
        });
    });
    // delete created cart items
    afterEach((done) => {
      console.log('testUserId in afterEach', testUserId);
      if (addedCartItemsIds.length > 0) {
        CartItem.destroy({ where: { user_id: testUserId } }).then(() => {
          addedCartItemsIds = [];
          done();
        });
      } else {
        done();
      }
    });
    // delete created orders
    after((done) => {
      if (createdOrderIds.length > 0) {
        OrderItems.destroy({ where: { order_id: createdOrderIds } }).then(() => {
          Order.destroy({ where: { id: createdOrderIds } }).then(() => {
            createdOrderIds = [];
            done();
          });
        });
      }
    });
    //Teardown log out and delete user
    after((done) => {
      agent.get("/users/logout").end((err, res) => {
        console.log('testUserId in logout', testUserId);
        User.destroy({ where: { id: testUserId } }).then(() => {
          done(err);
        });
      });
    });
    //tests:
    describe("POST /cart as regular user", () => {
      it("it should add an item to the cart", (done) => {
        agent
          .post("/cart/add")
          .send({ item_id: testProductId, quantity: 2 })
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a("object");
            res.body.should.have.property("item_id");
            res.body.should.have.property("quantity");
            res.body.should.have.property("user_id");
            addedCartItemsIds.push(res.body.id);
            done(err);
          });
      });
      describe("post when item is already in cart", () => {
        //create an item in the cart to add to in the test case
        before((done) => {
          agent
            .post("/cart/add")
            .send({ item_id: testProductId, quantity: 2 })
            .end((err, res) => {
              done(err);
            });
        });
        it("should update the quantity of an item already in the cart", (done) => {
          agent
            .post("/cart/add")
            .send({ item_id: testProductId, quantity: 2 })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.have.property("item_id");
              res.body.should.have.property("quantity");
              res.body.should.have.property("user_id");
              res.body.quantity.should.equal(4);
              addedCartItemsIds.push(res.body.id);
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
          .send({ item_id: testProductId, quantity: 2 })
          .end((err, res) => {
            addedCartItemsIds.push(res.body.id);
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
          .send({ item_id: testProductId, quantity: 2 })
          .end((err, res) => {
            done(err);
          });
      });
      it("deletes an item from the cart", (done) => {
        agent.delete(`/cart/${testProductId}`).end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.message.should.equal("Item removed from cart");
          done(err);
        });
      });
      it("returns a message if the item is not in the cart", (done) => {
        agent.delete(`/cart/${nonExistentProductId}`).end((err, res) => {
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
          .send({ item_id: testProductId, quantity: 2 })
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
          .send({ item_id: testProductId, quantity: 2 })
          .end((err, res) => {
            done(err);
          });
      });
      it("updates the quantity of an item in the cart", (done) => {
        agent
          .put(`/cart/${testProductId}`)
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
          .put(`/cart/${nonExistentProductId}`)
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
        return (
          agent
            .post("/cart/add")
            .send({ item_id: testProductId, quantity: 4 })
            .then((res) => {
              return agent
                .post("/cart/add")
                .send({ item_id: testProductId, quantity: 5 });
            })
            .catch((err) => {
              throw new Error("Setup failed");
            })
        );
      });
      it("should checkout successfully", (done) => {
        agent
          .post("/cart/checkout")
          .send({ address_id: 11 })
          .end(async (err, res) => {
            res.should.have.status(200);
            res.body.message.should.equal("Checkout successful");

            // Verify the order
            const order = await Order.findOne({
              where: { user_id: testUserId },
            });
            order.should.exist;

            createdOrderIds.push(order.id);

            // Verify the order items
            const orderItem = await OrderItems.findOne({
              where: { order_id: order.id },
            });
            orderItem.should.exist;
            done();
          });
      });
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
