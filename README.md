# E-commerce App API

## Overview
This E-commerce App API enables e-commerce functionalities including account management, product browsing, cart management, and simulated purchase processes. Administrators have additional capabilities for product, order, and inventory management. The API is built using Node.js with Express and uses PostgreSQL for database management.

## My thoughts on the project
This is my first time writing an API and working with databases. I have learned a lot during this project that will make the next one both easier and prettier. In general you can probably find which files I worked on last by seeing how my code has improved throughout. This is obviously not meant to go into production, if it was there would be cleanup, optimization and general improvements needed to be implemented. I would also need to implement a system for payments which is not currently present, I would also rename some of the routes, files and tables for clarity/consistency as well as adding more and better tests.

For now though I'm happy with what I've got seeing as it is a project done purely for learning and I have learned a lot

The frontend might be implemented later as a further learning experience but for now all relevant work is in the backend.

## Getting Started

### Prerequisites
- Node.js (latest stable version)
- PostgreSQL
- npm

### Installation
1. Clone the repository:
```bash
git clone https://github.com/Williamem/E-commerce_app_API.git
```
2. Navigate to the project directory:
```bash
cd E-commerce_app_API
```
3. Install dependencies:
```bash
npm install
```
4. Set up your PostgreSQL database and make sure it is running. Queries to run can be found in Documentation/database.sql

5. Create a `.env` file in the project root directory and add your database configurations and other environment variables as needed:
```
PORT=4001
DB_HOST=localhost
DB_NAME=e-commerce-api
DB_PORT=5432
DB_DIALECT=postgres
DB_USER=ecommerce_app
DB_PASSWORD=password
NODE_ENV=development
```

6. Start the server:
```bash
npm start
```
For development, you may use:
```bash
npm run dev
```
to utilize Nodemon for hot reloading.

## Technologies Used

- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Testing:** Mocha, Chai
- **Documentation:** Swagger
- **Authentication:** Passport, bcryptjs for password hashing
- **Environment Variables:** dotenv
- **Logging:** morgan (for HTTP request logging)
- **Error Handling:** Custom error handling middleware

## Features
- User account creation and authentication
- Browsing products and managing shopping basket
- Simulated checkout and purchase process
- Admin functionalities for managing products, orders, and inventory
- Secure authentication and authorization
- API documentation using Swagger for easy integration

## API Documentation
Swagger file in documentation folder. This folder also include other documents used during the work process

## Running Tests
To run the test suite, simply execute:
```bash
npm test
```
Ensure that all tests are passing to maintain application integrity.

## Security
This project implements hashed passwords, JWT-based authentication, input validation, and role-based access control to ensure data security and user privacy.

## License
You are free to use this code as you please. I recommend that you don't though since it's a learning project and you will be able to find something better written that suits your needs

## Contact
Your Name - william.emanuelsson@gmail.com.com

Project Link: [hhttps://github.com/Williamem/E-commerce_app_API](https://github.com/Williamem/E-commerce_app_API)

---