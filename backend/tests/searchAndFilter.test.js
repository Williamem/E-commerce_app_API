const Product = require('../models/Product');
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

chai.should();
chai.use(chaiHttp);

describe('Search and Filter', () => {
    describe('GET /products/search', () => {
        it('returns a list of products that match the search query', (done) => {
            chai.request(server)
                .get('/products/search?query=product')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.greaterThan(0);
                    done();
                });
        });
        it('returns a list of products that match the search query written in casing not matching db', (done) => {
            chai.request(server)
                .get('/products/search?query=pRoDuCt')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.greaterThan(0);
                    done();
                });
        });
        it('doesn\'t return any products if the search query does not match any products', (done) => {
            chai.request(server)
                .get('/products/search?query=nonexistentproduct')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.message.should.equal('No products found');
                    done();
                });
        });
    });
    describe('GET /products/filter/:category', () => {
        it('returns a list of products that belong to the specified category', (done) => {
            chai.request(server)
                .get('/products/filter/electronics')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.greaterThan(0);
                    done();
                });
            });
    });
        it('doesn\'t return any products if the category does not exist', (done) => {
            chai.request(server)
                .get('/products/filter/nonexistentcategory')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.message.should.equal('Product category not found');
                    done();
                });
        });
    describe('GET /products/categories', () => {
        it('returns a list of all categories', (done) => {
            chai.request(server)
                .get('/products/categories')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.greaterThan(0);
                    done();
                });
        });
    });
});