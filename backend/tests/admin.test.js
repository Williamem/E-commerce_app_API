const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { User, Order, OrderItems } = require("../models/index");

chai.should();
chai.use(chaiHttp);

const admin = { email: "admin@example.com", password: "password" };
const user = { email: "user_for_testing@example.com", password: "password" };
let createdOrderIds = [];

describe("/admin routes", () => {
  describe("admin routes as admin", () => {
    // Setup log in admin
    /*     let agent;
    before((done) => {
      agent = chai.request.agent(server);
      agent
        .post("/users/login")
        .send(admin)
        .end((err, res) => {
          done(err);
        });
    }); */

    let agent;
    before((done) => {
      agent = chai.request.agent(server);
      agent
        .post("/users/login")
        .send(admin)
        .then((res) => {
          return agent.post("/cart/add").send({ item_id: 1, quantity: 1 });
        })
        .then((res) => {
          return agent.post("/cart/checkout").send({ address_id: 11 });
        })
        .then((res) => {
          createdOrderIds.push(res.body.newOrder.id);
          done();
        })
        .catch((err, res) => {
          done(err);
        });
    });

    after((done) => {
      // teardown log out user
      agent.get("/users/logout").end((err, res) => {
        if (createdOrderIds.length > 0) {
          for (let i = 0; i < createdOrderIds.length; i++) {
            OrderItems.destroy({ where: { order_id: createdOrderIds[i] } });
            Order.destroy({ where: { id: createdOrderIds[i] } });
          }
          createdOrderIds = [];
        }
        done(err);
      });
    });
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
          done();
        })
        .catch((err, res) => {
          done(err);
        });
    });
    after((done) => {
      // teardown log out user
      agent.get("/users/logout").end((err, res) => {
        if (createdOrderIds.length > 0) {
          for (let i = 0; i < createdOrderIds.length; i++) {
            OrderItems.destroy({ where: { order_id: createdOrderIds[i] } });
            Order.destroy({ where: { id: createdOrderIds[i] } });
          }
          createdOrderIds = [];
        }
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
    describe('GET /admin/orders', () => {
        it('it should return error 403', (done) => {
            agent.get('/admin/orders').end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });
    });
    describe('GET /admin/orders/:id', () => {
        it('it should return error 403', (done) => {
            agent.get(`/admin/orders/${createdOrderIds[0]}`).end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });
    });
    describe('PUT /admin/orders/:id', () => {
        it('it should return error 403', (done) => {
            agent.put(`/admin/orders/${createdOrderIds[0]}`).end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });
    });
  });
  describe("admin routes as guest", () => {});
});
