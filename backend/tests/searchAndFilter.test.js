const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { Product } = require("../models/index");

chai.should();
chai.use(chaiHttp);

let productCategory;
let productName;
let productNameMismatchedCasing;
const nonExistentProduct = "nonexistentproduct";
const nonExistentProductCategory = "nonexistentcategory";
let createdProductIds = [];

describe("Search and Filter", () => {
  //setup create a product
  before((done) => {
    Product.create({
      name: "Test Product",
      price: 100,
      description: "Test description",
      imageUrl: "test.jpg",
      category: "electronics",
    }).then((product) => {
      createdProductIds.push(product.id);
      productCategory = product.category;
      productName = product.name;
      productNameMismatchedCasing = product.name.toUpperCase();
      done();
    });
  });
  //teardown delete the product
  after((done) => {
    Product.destroy({ where: { id: createdProductIds } }).then(() => {
      done();
    });
  });

  describe("GET /products/search", () => {
    it("returns a list of products that match the search query", (done) => {
      chai
        .request(server)
        .get(`/products/search?query=${productName}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.greaterThan(0);
          done();
        });
    });
    it("returns a list of products that match the search query written in casing not matching db", (done) => {
      chai
        .request(server)
        .get(`/products/search?query=${productNameMismatchedCasing}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.greaterThan(0);
          done();
        });
    });
    it("doesn't return any products if the search query does not match any products", (done) => {
      chai
        .request(server)
        .get(`/products/search?query=${nonExistentProduct}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.message.should.equal("No products found");
          done();
        });
    });
  });
  describe("GET /products/filter/:category", () => {
    it("returns a list of products that belong to the specified category", (done) => {
      chai
        .request(server)
        .get(`/products/filter/${productCategory}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.greaterThan(0);
          done();
        });
    });
  });
  it("doesn't return any products if the category does not exist", (done) => {
    chai
      .request(server)
      .get(`/products/filter/${nonExistentProductCategory}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.message.should.equal("Product category not found");
        done();
      });
  });
  describe("GET /products/categories", () => {
    it("returns a list of all categories", (done) => {
      chai
        .request(server)
        .get("/products/categories")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.greaterThan(0);
          done();
        });
    });
  });
});
