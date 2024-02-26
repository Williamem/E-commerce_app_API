const User = require('../models/User');
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const Product = require('../models/Product');

chai.should();
chai.use(chaiHttp);

let createdProductIds = [];

describe('/products routes', () => {
    describe('/products routes as admin user', () => {
        // Setup
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

        describe('POST products/add as admin', () => {

            it('creates a new product when all values are correctly filled in', (done) => {
                const product = {
                    name: 'test product',
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
                });
            });

            it('creates a new product with only name supplied', (done) => {
                const product = {
                    name: 'test product'
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
                });
            });

            it('sets stock to 0 if no info is supplied', (done) => {
                const product = {
                    name: 'test product'
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
                });
            });
        });

        describe('PUT products/:id as admin', () => {

            it('updates an existing product with valid data', (done) => {
                const updatedProductData = {
                    name: 'Updated test product',
                    price: 120,
                    description: 'An updated test product description',
                    stock: 15,
                    image_url: 'http://updatedtestimage.jpeg',
                    category: 'testing products'
                };
        
                const productIdToUpdate = createdProductIds[0];
                if (!createdProductIds[0]) {
                    return console.log('the product to update doesn\'t exist');
                }
        
                chai.request(server)
                    .put(`/products/${productIdToUpdate}`)
                    .send(updatedProductData)
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('id', productIdToUpdate);
                        response.body.should.have.property('name', updatedProductData.name);
                        response.body.should.have.property('price', updatedProductData.price);
                        response.body.should.have.property('description', updatedProductData.description);
                        response.body.should.have.property('stock', updatedProductData.stock);
                        response.body.should.have.property('image_url', updatedProductData.image_url);
                        response.body.should.have.property('category', updatedProductData.category);
                        done();
                    });
            });
        
            it('returns a 404 error for an invalid product ID', (done) => {
                const updatedProductData = {
                    name: 'Updated test product',
                    price: 120
                    // ... other updated fields
                };
        
                const invalidProductId = 2;
        
                chai.request(server)
                    .put(`/products/${invalidProductId}`)
                    .send(updatedProductData)
                    .end((err, response) => {
                        response.should.have.status(404);
                        done();
                    });
            });
        });
            
        // teardown, log out admin
        after((done) => {
            chai.request(server)
                .get('/users/logout')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });        
    });
    describe('/products routes as regular user', () => {
        // Setup, login regular user
        let agent;
        before((done) => {
            agent = chai.request.agent(server);
            agent
                .post('/users/login')
                .send({email: 'testuser@example.com', password: 'password'})
                .end((err, res) => {
                    done(err);
                });
        });
        describe('POST products/add as regular user', () => {

            it('fails to add a product as regular user', (done) => {
                const product = {
                    name: 'test product',
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
                        response.should.have.status(403);
                        response.text.should.include('Unauthorized');
                        if (response.body.id) {
                            createdProductIds.push(response.body.id);
                        }
                        done();
                    });
            });
        });

        describe('PUT products/:id as regular user', () => {

            it('doesn\'t allow a reguar user to update a product', (done) => {
                const updatedProductData = {
                    name: 'Updated test product',
                    price: 120
                    // ... other updated fields
                };
        
                const productIdToUpdate = createdProductIds[0]; // Replace with a non-existent product ID
                if (!createdProductIds[0]) {
                    return console.log('no product to update')
                }
        
                chai.request(server)
                    .put(`/products/${productIdToUpdate}`)
                    .send(updatedProductData)
                    .end((err, response) => {
                        response.should.have.status(403);
                        response.text.should.include('Unauthorized');
                        done();
                    });
            });
        });

        // teardown logout regular user
        after((done) => {
            chai.request(server)
                .get('/users/logout')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });
    });

    // Teardown, delete products created in test
    after(async () => {
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
});