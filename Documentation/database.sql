-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE,
    password VARCHAR(60)
    createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create the shipping_addresses table
CREATE TABLE shipping_addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(50),
    country VARCHAR(50),
    state VARCHAR(50),
    city VARCHAR(100),
    address VARCHAR(100)
);


-- Create the items table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    price DECIMAL,
    description TEXT,
    stock INTEGER,
    image_url VARCHAR(200),
    category VARCHAR(50)
);

-- Create the orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    order_date DATE,
    total_price DECIMAL,
    ship_date DATE,
    status VARCHAR(50) CHECK(status IN ('pending', 'shipped', 'delivered')),
    tracking_information TEXT,
    address_id INT REFERENCES shipping_addresses(id)
);


-- Create the orders_items table
CREATE TABLE orders_items (
    order_id INTEGER REFERENCES orders(id),
    item_id INTEGER REFERENCES items(id),
    quantity INTEGER
);

-- Create cart_items table
CREATE TABLE cart_items (
    user_id INTEGER REFERENCES users(id),
    item_id INTEGER REFERENCES items(id),
    quantity INTEGER
);

-- Create user_roles table
CREATE TABLE user_roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE
);

-- Add rows for user_roles
INSERT INTO user_roles (role_name) VALUES ('admin'), ('regular_user');

-- Add role_id column to users table
ALTER TABLE users ADD COLUMN role_id INT REFERENCES user_roles(role_id);

-- create role for app and grant required priviledges
CREATE ROLE ecommerce_app WITH LOGIN PASSWORD 'password';

GRANT ALL PRIVILEGES ON TABLE users TO ecommerce_app;
GRANT ALL PRIVILEGES ON TABLE shipping_addresses TO ecommerce_app;
GRANT ALL PRIVILEGES ON TABLE items TO ecommerce_app;
GRANT ALL PRIVILEGES ON TABLE orders TO ecommerce_app;
GRANT ALL PRIVILEGES ON TABLE orders_items TO ecommerce_app;
GRANT ALL PRIVILEGES ON TABLE cart_items TO ecommerce_app;
GRANT ALL PRIVILEGES ON TABLE user_roles TO ecommerce_app;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ecommerce_app;

-- create admin user, this is necessary if you want to test the admin routes in postman, there also isn't a way to create an admin user from the app
INSERT INTO users (email, password, role_id) 
VALUES ('admin@example.com', 'password', 
    (SELECT role_id FROM user_roles WHERE role_name = 'admin'));

