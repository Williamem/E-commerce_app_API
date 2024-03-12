const { User } = require("../models/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

chai.should();
chai.use(chaiHttp);

// keep track of the created user ids
let createdUserIds = [];
describe("/users routes", () => {
  describe("POST /users/register", () => {
    afterEach(async () => {
      // Teardown: delete the created user
      try {
        if (createdUserIds.length > 0) {
          for (let i = 0; i < createdUserIds.length; i++) {
            const id = createdUserIds[i];
            const user = await User.findByPk(id); // find the user by PK
            if (user) {
              await user.destroy(); // delete the user
            }
          }
          createdUserIds = []; // empty the array
        }
      } catch (err) {
        console.log(err);
      }
    });
    describe("It should succesfully register a new user", () => {
      it("It should register a new user", (done) => {
        const user = {
          email: "testemai123@test.com",
          password: "testPassword",
        };

        chai
          .request(server)
          .post("/users/register")
          .send(user)
          .end((err, response) => {
            response.should.have.status(201);
            response.body.should.be.a("object");
            response.body.should.have.property("id");
            response.body.should.have.property("email");
            createdUserIds.push(response.body.id);
            done();
          });
      });
    });

    describe("It should NOT register a new user", () => {
        const user = {
          email: "sameemail@test.com",
          password: "testPassword",
        };
        // Setup: create a user
        before((done) => {
          chai
            .request(server)
            .post("/users/register")
            .send(user)
            .end((err, response) => {
              done();
            });
        });
        // Teardown: delete the created user
        after((done) => {
          User.destroy({ where: { email: user.email } }).then(() => {
            done();
          });
        });
      it("It should NOT register a new user with an existing email", (done) => {
        // Test: try to create a user with the same email
        chai
          .request(server)
          .post("/users/register")
          .send(user)
          .end((err, response) => {
            response.should.have.status(400);
            response.text.should.include("User already exists");
            done();
          });
      });
      it("It should NOT register a new user without email field", (done) => {
        const user = {
          password: "testPassword",
          // exclude email
        };

        chai
          .request(server)
          .post("/users/register")
          .send(user)
          .end((err, response) => {
            response.should.have.status(400);
            response.text.should.include("Email is required");
            done();
          });
      });

      it("It should NOT register a new user without password field", (done) => {
        const user = {
          email: "email@example123.com",
        };

        chai
          .request(server)
          .post("/users/register")
          .send(user)
          .end((err, response) => {
            response.should.have.status(400);
            response.text.should.include("Password is required");
            done();
          });
      });

      it("It should NOT register a new user if email is shorter than 6", (done) => {
        const user = {
          email: "e@e.c",
          password: "123456",
        };

        chai
          .request(server)
          .post("/users/register")
          .send(user)
          .end((err, response) => {
            response.should.have.status(400);
            response.text.should.include(
              "Email should have a minimum length of 6"
            );
            done();
          });
      });

      it("It should NOT register a new user if password is shorter than 6", (done) => {
        const user = {
          email: "email@example123.com",
          password: "12345",
        };

        chai
          .request(server)
          .post("/users/register")
          .send(user)
          .end((err, response) => {
            response.should.have.status(400);
            response.text.should.include(
              "Password should have a minimum length of 6"
            );
            done();
          });
      });
    });
  });

  describe("POST users/login", () => {
    it("logs in an existing user", (done) => {
      const user = {
        email: "testuser@example.com",
        password: "password",
      };
      chai
        .request(server)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          response.text.should.include("Log in successful");
          done();
        });
    });
    it("fails to login with incorrect password", (done) => {
      const user = {
        email: "testuser@example.com",
        password: "wrongPassword",
      };
      chai
        .request(server)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(401);
          response.text.should.include("Unauthorized");
          done();
        });
    });
    it("fails to login nonexistant user", (done) => {
      const user = {
        email: "notAUser@example.com",
        password: "wrongPassword",
      };
      chai
        .request(server)
        .post("/users/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(401);
          response.text.should.include("Unauthorized");
          done();
        });
    });
    it("logs out user", (done) => {
      chai
        .request(server)
        .get("/users/logout")
        .end((err, response) => {
          response.should.have.status(200);
          response.text.should.include("logged out");
          done();
        });
    });
  });
});
