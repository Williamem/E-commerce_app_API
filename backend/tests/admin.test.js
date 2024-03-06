const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
/* const User = require("../models/User");
const Order = require("../models/Order");
const OrderItems = require("../models/OrderItems"); */
const { User, Order, OrderItems } = require("../models/index");

chai.should();
chai.use(chaiHttp);