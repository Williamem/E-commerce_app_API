const Product = require('../models/Product');
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const Product = require('../models/Product');

chai.should();
chai.use(chaiHttp);

describe('Search and Filter', () => {
    describe('GET /products/search', () => {
        it('returns a list of products that match the search query', (done) => {
            chai.request(server)
                .get('/products/search?query=product')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.length.should.be.greaterThan(0);
                    done();
                });
        });
        it('does\'nt return any products if the search query does not match any products', (done) => {
            chai.request(server)
                .get('/products/search?query=nonexistentproduct')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.length.should.equal(0);
                    done();
                });
        });
    });
    describe('GET /products/category', () => {
        it('returns a list of products that belong to the specified category', (done) => {
            chai.request(server)
                .get('/products/category?category=electronics')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.length.should.be.greaterThan(0);
                    done();
                });
            });
    });
        it('doesn\'t return any products if the category does not exist', (done) => {
            chai.request(server)
                .get('/products/category?category=nonexistentcategory')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.length.should.equal(0);
                    done();
                });
        });
});