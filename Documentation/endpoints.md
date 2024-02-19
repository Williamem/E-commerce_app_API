1. User Management:
   - `POST /register`: Create a new user account
   - `POST /login`: User login and authentication
   - `GET /users/{id}`: Retrieve user details

2. Product Management:
   - `GET /products`: Retrieve a list of products
   - `GET /products/{id}`: Retrieve details of a specific product
   - `POST /products`: Add a new product (admin only)
   - `PUT /products/{id}`: Update an existing product (admin only)
   - `DELETE /products/{id}`: Remove a product (admin only)

3. Cart and Checkout:
   - `GET /cart`: Retrieve the user's cart items
   - `POST /cart/items`: Add an item to the user's cart
   - `PUT /cart/items/{id}`: Update the quantity of an item in the user's cart
   - `DELETE /cart/items/{id}`: Remove an item from the user's cart
   - `POST /orders`: Place a new order

4. Admin Functions:
   - `GET /admin/products`: Retrieve a list of products (admin only)
   - `GET /admin/orders`: Retrieve a list of orders (admin only)
   - `PUT /admin/orders/{id}`: Update the status of an order (admin only)

5. User Profile:
   - `GET /profile`: Retrieve the user's profile details
   - `PUT /profile`: Update the user's profile

6. Search and Filter:
   - `GET /products?category={category}`: Retrieve products based on category
   - `GET /products/search?name={name}`: Search for products by name

7. Static Content:
   - `GET /about`: Retrieve the about page content
   - `GET /contact`: Retrieve the contact page content

8. Payment and Orders:
   - `POST /payment`: Process a payment for an order
   - `GET /orders`: Retrieve a list of the user's orders
   - `GET /orders/{id}`: Retrieve details of a specific order
   - `PUT /orders/{id}`: Update an existing order