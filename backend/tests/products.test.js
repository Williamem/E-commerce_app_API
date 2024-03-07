const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { Product } = require("../models/index");

chai.should();
chai.use(chaiHttp);

const testUser = {
  email: "user_for_testing@example.com",
  password: "password",
};
let createdProductIds = [];

describe.skip("/products routes", () => {
  describe("/products routes while not signed in", () => {
    describe("GET /products/:id", () => {
      it("returns an object containing product information", (done) => {
        chai
          .request(server)
          .get("/products/1")
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a("object");
            response.body.should.have.property("id");
            response.body.should.have.property("name");
            done();
          });
      });
    });
    describe("GET /products", () => {
      it("returns an object of all products", (done) => {
        chai
          .request(server)
          .get("/products")
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a("array");
            done();
          });
      });
    });
  });
});
