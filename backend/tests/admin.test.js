const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const {
  User,
  Order,
  OrderItems,
  Product,
  Address,
} = require("../models/index");

chai.should();
chai.use(chaiHttp);

const admin = {
  email: "admin@test.com",
  password: "password",
};
const user = {
  email: "test_user_admin@test.com.com",
  password: "password",
};
let testUserId;
let createdAddressIds = [];
let createdUserIds = [];
let createdOrderIds = [];
let createdProductIds = [];
const testProduct = {
  name: "test product",
  price: 100,
  description: "a great test product",
  stock: 10,
  image_url: "http://testimage.jpeg",
  category: "testing products",
};
const updatedProductData = {
  name: "Updated test product",
  price: 120,
  description: "An updated test product description",
  stock: 15,
  image_url: "http://updatedtestimage.jpeg",
  category: "testing products",
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
describe("/admin routes", () => {
  //setup create a user and an address
  before(async () => {
    try {
      const agent = chai.request.agent(server);
      //create a test user
      await agent
        .post("/users/register")
        .send(user)
        .then((res) => {
          testUserId = res.body.id;
          createdUserIds.push(testUserId);
        });
      // create an admin user
      await agent
        .post("/users/register")
        .send(admin)
        .then((res) => {
          createdUserIds.push(res.body.id);
        });
      await User.update({ role_id: 1 }, { where: { id: createdUserIds[1] } });
      //create an address
      /*       const address = await Address.create({
        ...validAddress,
        user_id: testUserId,
      });
      createdAddressIds.push(address.id); */
      //create a product
      const product = await Product.create(testProduct);
      createdProductIds.push(product.id);
      //sign in user
      await agent.post("/users/login").send(user);
      //add an address to user
      await agent
        .post("/profile/address")
        .send(validAddress)
        .then((res) => {
          createdAddressIds.push(res.body.id);
        });
      //add product to cart
      await agent
        .post("/cart/add")
        .send({ item_id: createdProductIds[0], quantity: 1 });
      //checkout
      const orderResponse = await agent
        .post("/cart/checkout")
        .send({ address_id: createdAddressIds[0] })
        .then((res) => {
          createdOrderIds.push(res.body.newOrder.id);
        });
      await agent.get("/users/logout");
    } catch (err) {
      console.log("error in before :", err);
    }
  });
  const agent = chai.request.agent(server);
  // teardown
  after(async () => {
    try {
      //delete created orders
      if (createdOrderIds.length > 0) {
        for (let i = 0; i < createdOrderIds.length; i++) {
          await OrderItems.destroy({ where: { order_id: createdOrderIds[i] } });
          await Order.destroy({ where: { id: createdOrderIds[i] } });
        }
        createdOrderIds = [];
      }
      //delete created products
      if (createdProductIds.length > 0) {
        for (let i = 0; i < createdProductIds.length; i++) {
          await Product.destroy({ where: { id: createdProductIds[i] } });
        }
        createdProductIds = [];
      }
      //delete created addresses
      if (createdAddressIds.length > 0) {
        for (let i = 0; i < createdAddressIds.length; i++) {
          await Address.destroy({ where: { id: createdAddressIds[i] } });
        }
        createdAddressIds = [];
      }
      //delete created users
      if (createdUserIds.length > 0) {
        for (let i = 0; i < createdUserIds.length; i++) {
          await User.destroy({ where: { id: createdUserIds[i] } });
        }
        createdUserIds = [];
      }
    } catch (err) {
      console.log(err);
    }
  });
  describe("admin routes as admin", () => {
    // log in admin user
    let agent;
    before((done) => {
      agent = chai.request.agent(server);
      agent
        .post("/users/login")
        .send(admin)
        .end((err, response) => {
          console.log("response.body", response.body);
          done(err);
        });
    });
    after((done) => {
      // teardown log out user
      agent.get("/users/logout").end((err, res) => {
        done(err);
      });
    });
    describe("admin routes as admin", () => {
      describe("GET /admin/users", () => {
        it("it should GET all users", (done) => {
          agent.get("/admin/users").end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
          });
        });
      });
      describe("GET /admin/orders", () => {
        it("it should GET all orders", (done) => {
          agent.get("/admin/orders").end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
          });
        });
      });
      describe("GET admin/orders/:id", () => {
        it("it should GET an order by the given id", (done) => {
          agent.get(`/admin/orders/${createdOrderIds[0]}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
        });
      });
      describe("PUT /admin/orders/:id", () => {
        it("it should update an order by the given id", (done) => {
          agent
            .put(`/admin/orders/${createdOrderIds[0]}`)
            .send({
              status: "shipped",
              tracking_information: "Post Nord 1234567",
            })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.have.property("status").eql("shipped");
              res.body.should.have
                .property("tracking_information")
                .eql("Post Nord 1234567");
              res.body.should.have
                .property("ship_date")
                .eql(new Date().toISOString().split("T")[0]);
              done();
            });
        });
      });
      describe("POST products/add as admin", () => {
        it("creates a new product when all values are correctly filled in", (done) => {
          agent
            .post("/admin/products/add")
            .send(testProduct)
            .end((err, response) => {
              response.should.have.status(201);
              response.body.should.be.a("object");
              response.body.should.have.property("id");
              response.body.should.have.property("name");
              response.body.should.have.property("price");
              response.body.should.have.property("description");
              response.body.should.have.property("stock");
              response.body.should.have.property("image_url");
              response.body.should.have.property("category");
              createdProductIds.push(response.body.id);
              done();
            });
        });

        it("creates a new product with only name supplied", (done) => {
          const product = {
            name: "test product",
          };
          agent
            .post("/admin/products/add")
            .send(product)
            .end((err, response) => {
              response.should.have.status(201);
              response.body.should.be.a("object");
              response.body.should.have.property("id");
              response.body.should.have.property("name");
              response.body.should.have.property("price");
              response.body.should.have.property("description");
              response.body.should.have.property("stock");
              response.body.should.have.property("image_url");
              response.body.should.have.property("category");
              createdProductIds.push(response.body.id);
              done();
            });
        });

        it("sets stock to 0 if no info is supplied", (done) => {
          const product = {
            name: "test product",
          };
          agent
            .post("/admin/products/add")
            .send(product)
            .end((err, response) => {
              response.should.have.status(201);
              response.body.should.be.a("object");
              response.body.stock.should.equal(0);
              createdProductIds.push(response.body.id);
              done();
            });
        });
      });

      describe("PUT products/:id as admin", () => {
        it("updates an existing product with valid data", (done) => {
          const productIdToUpdate = createdProductIds[0];
          if (!createdProductIds[0]) {
            return console.log("the product to update doesn't exist");
          }

          agent
            .put(`/admin/products/${productIdToUpdate}`)
            .send(updatedProductData)
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a("object");
              response.body.should.have.property("id", productIdToUpdate);
              response.body.should.have.property(
                "name",
                updatedProductData.name
              );
              response.body.should.have.property(
                "price",
                updatedProductData.price
              );
              response.body.should.have.property(
                "description",
                updatedProductData.description
              );
              response.body.should.have.property(
                "stock",
                updatedProductData.stock
              );
              response.body.should.have.property(
                "image_url",
                updatedProductData.image_url
              );
              response.body.should.have.property(
                "category",
                updatedProductData.category
              );
              done();
            });
        });

        it("returns a 404 error for an invalid product ID", (done) => {
          const updatedProductData = {
            name: "Updated test product",
            price: 120,
          };

          const invalidProductId = 2;

          agent
            .put(`/admin/products/${invalidProductId}`)
            .send(updatedProductData)
            .end((err, response) => {
              response.should.have.status(404);
              done();
            });
        });
      });
    });
    describe("DELETE /admin/products/:id as admin", () => {
      //create a product to be deleted
      let productToDeleteId;

      before((done) => {
        // Create a product to be deleted
        const productData = {
          name: "Test product to be deleted",
        };

        agent
          .post("/admin/products/add")
          .send(productData)
          .end((err, response) => {
            productToDeleteId = response.body.id;
            done(err);
          });
      });

      it("deletes an existing product", (done) => {
        agent
          .delete(`/admin/products/${productToDeleteId}`)
          .end((err, response) => {
            response.should.have.status(200);
            done();
          });
      });

      it("returns a 404 error for an invalid product ID", (done) => {
        const invalidProductId = 2;

        agent
          .delete(`/admin/products/${invalidProductId}`)
          .end((err, response) => {
            response.should.have.status(404);
            done();
          });
      });
    });
    describe("GET /admin/products/:id as admin", () => {
      it("it should return a product by the given id", (done) => {
        agent.get(`/admin/products/${createdProductIds[0]}`).end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("id").eql(createdProductIds[0]);
          done();
        });
      });
    });
  });
  describe("admin routes as user", () => {
    let agent;
    before((done) => {
      agent = chai.request.agent(server);
      agent
        .post("/users/login")
        .send(user)
        .then((res) => {
          return agent.post("/cart/add").send({ item_id: 1, quantity: 1 });
        })
        .then((res) => {
          return agent.post("/cart/checkout").send({ address_id: 11 });
        })
        .then((res) => {
          createdOrderIds.push(res.body.newOrder.id);
          console.log("res.body.newOrder.id", res.body.newOrder.id);
          done();
        })
        .catch((err, res) => {
          done(err);
        });
    });
    after((done) => {
      // teardown log out user
      agent.get("/users/logout").end((err, res) => {
        done(err);
      });
    });
    describe("GET /admin/users", () => {
      it("it should return error 403", (done) => {
        agent.get("/admin/users").end((err, res) => {
          res.should.have.status(403);
          done();
        });
      });
    });
    describe("GET /admin/orders", () => {
      it("it should return error 403", (done) => {
        agent.get("/admin/orders").end((err, res) => {
          res.should.have.status(403);
          done();
        });
      });
    });
    describe("GET /admin/orders/:id", () => {
      it("it should return error 403", (done) => {
        agent.get(`/admin/orders/${createdOrderIds[0]}`).end((err, res) => {
          res.should.have.status(403);
          done();
        });
      });
    });
    describe("PUT /admin/orders/:id", () => {
      it("it should return error 403", (done) => {
        agent.put(`/admin/orders/${createdOrderIds[0]}`).end((err, res) => {
          res.should.have.status(403);
          done();
        });
      });
    });
    describe("POST products/add as regular user", () => {
      it("fails to add a product as regular user", (done) => {
        agent
          .post("/admin/products/add")
          .send(product)
          .end((err, response) => {
            response.should.have.status(403);
            response.text.should.include("Unauthorized");
            if (response.body.id) {
              createdProductIds.push(response.body.id);
            }
            done();
          });
      });
    });
    describe("PUT products/:id as regular user", () => {
      it("doesn't allow a regular user to update a product", (done) => {
        const updatedProductData = {
          name: "Updated test product",
          price: 120,
          // ... other updated fields
        };

        const productIdToUpdate = createdProductIds[0];
        if (!createdProductIds[0]) {
          return console.log("no product to update");
        }

        chai
          .request(server)
          .put(`/admin/products/${productIdToUpdate}`)
          .send(updatedProductData)
          .end((err, response) => {
            response.should.have.status(403);
            response.text.should.include("Unauthorized");
            done();
          });
      });
    });
  });
});

/* describe("/admin routes", () => {
  //setup create a user and an address
  before((done) => {
    User.create(user).then((user) => {
      createdUserIds.push(user.id);
      done();
    });
  });
  // teardown delete created users
  after((done) => {
    if (createdUserIds.length > 0) {
      for (let i = 0; i < createdUserIds.length; i++) {
        User.destroy({ where: { id: createdUserIds[i] } });
      }
      createdUserIds = [];
    }
    done();
  });
  // teardown delete created orders and products
  after((done) => {
    if (createdOrderIds.length > 0) {
      for (let i = 0; i < createdOrderIds.length; i++) {
        OrderItems.destroy({ where: { order_id: createdOrderIds[i] } });
        Order.destroy({ where: { id: createdOrderIds[i] } });
      }
      createdOrderIds = [];
    }
    if (createdProductIds.length > 0) {
      for (let i = 0; i < createdProductIds.length; i++) {
        Product.destroy({ where: { id: createdProductIds[i] } });
      }
      createdProductIds = [];
    }
    done();
  });
 
    });

  });
  describe("admin routes as guest", () => {});
}); */
