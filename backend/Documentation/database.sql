-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE,
    password VARCHAR(60)
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
    image_url VARCHAR(200) UNIQUE
);

-- Create the orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    order_date DATE,
    total_price DECIMAL,
    ship_date DATE,
    status VARCHAR(50) CHECK(status IN ('pending', 'shipped', 'delivered')),
    tracking_information TEXT
);

-- Create the orders_items table
CREATE TABLE orders_items (
    order_id INTEGER REFERENCES orders(id),
    item_id INTEGER REFERENCES items(id),
    PRIMARY KEY (order_id, item_id)
);