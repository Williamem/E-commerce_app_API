const User = require('../models/User');
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app"); // import your express app
const Product = require('../models/Product');

chai.should();
chai.use(chaiHttp);

let createdProductIds = [];

describe('/products routes', () => {
    describe('products/add as admin', () => {
        //setup
        let agent;
        before((done) => {
            agent = chai.request.agent(server);
            agent
                .post('/users/login')
                .send({email: 'admin@example.com', password: 'password'})
                .end((err, res) => {
                    done(err);
                });
        });

        //teardown
        afterEach(async () => {
            try {
                if (createdProductIds.length > 0) {
                    for (let i = 0; i < createdProductIds.length; i++) {
                        const id = createdProductIds[i];
                        const product = await Product.findByPk(id);
                        if (product) {
                            await product.destroy();
                        }
                    }
                    createdProductIds = [];
                }
            } catch (err) {
                console.log(err);
            }
        });

        it('creates a new product when all values are correctly filled in', (done) => {
            const product = {
                name: 'test pruduct',
                price: 100,
                description: 'a great test product',
                stock: 10,
                image_url: 'http://testimage.jpeg',
                category: 'testing products'
            };
            agent
                .post('/products/add')
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
            })
        });

        it('creates a new product with only name supplied', (done) => {
            const product = {
                name: 'test pruduct'
            };
            agent
                .post('/products/add')
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
            })
        });

        it('sets stock to 0 if no infor is supplied', (done) => {
            const product = {
                name: 'test pruduct'
            };
            agent
                .post('/products/add')
                .send(product)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a("object");
                    response.body.stock.should.equal(0);
                    createdProductIds.push(response.body.id);
                    done();
            })
        });

        after((done) => {
            chai.request(server)
            .get('/users/logout')
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                done();
            })
        })
    })
})