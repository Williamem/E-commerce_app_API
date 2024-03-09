const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { Product } = require("../models/index");

chai.should();
chai.use(chaiHttp);

const testUser = {
  email: "test_user_product@test.com.com",
  password: "password",
};
let createdProductIds = [];


describe("/products routes", () => {
  describe("/products routes while not signed in", () => {
    describe("GET /products/:id", () => {
      //setup create a product
      before((done) => {
        Product.create({
          name: "Test Product",
          price: 100,
          description: "Test description",
          imageUrl: "test.jpg",
        }).then((product) => {
          createdProductIds.push(product.id);
          done();
        });
      });
      //teardown delete the product
      after((done) => {
        Product.destroy({ where: { id: createdProductIds } }).then(() => {
          done();
        });
      });
      it("returns an object containing product information", (done) => {
        chai
          .request(server)
          .get(`/products/${createdProductIds[0]}`)
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
      it("returns an array with all products", (done) => {
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
