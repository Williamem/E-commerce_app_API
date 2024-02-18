# Database Schema

#### Table: users
- id (Primary Key, INTEGER)
- email (UNIQUE, VARCHAR(50))
- password (VARCHAR(60))

#### Table: shipping_addresses
- id (Primary Key, SERIAL)
- user_id (Foreign Key, INTEGER)
- first_name (VARCHAR(50))
- last_name (VARCHAR(50))
- phone (VARCHAR(50))
- country (VARCHAR(50))
- state (VARCHAR(50))
- city (VARCHAR(100))
- address (VARCHAR(100))

#### Table: items
- id (Primary Key, SERIAL)
- name (VARCHAR(50))
- price (DECIMAL)
- description (TEXT)
- stock (INTEGER)
- image_url (UNIQUE, VARCHAR(200))
- category (VARCHAR(50))

#### Table: orders
- id (Primary Key, SERIAL)
- user_id (Foreign Key, INTEGER)
- order_date (DATE)
- total_price (DECIMAL)
- ship_date (DATE)
- status (VARCHAR(50) CHECK(status IN ('pending', 'shipped', 'delivered'))
- tracking_information (TEXT)

#### Table: orders_items
- order_id (Foreign Key, INTEGER)
- item_id (Foreign Key, INTEGER)

#### Possible Indexes:
- Index on (user_id) in the orders table, to improve performance of user-specific queries.
- Index on (order_id) in the orders_items table, to optimize queries involving orders and their items.





### Tips and Suggestions
1. **Data Integrity**: Consider adding constraints and indexes to ensure data integrity and improve query performance. For example, you might consider adding unique constraints or foreign key constraints to maintain data consistency.

2. **Relationships**: Confirm that the relationships between the tables are correctly defined, and consider adding appropriate indexes on foreign keys for improved query performance.

3. **Additional Fields**: Depending on your specific requirements, consider if additional fields such as image URLs for products or tracking information for orders may be useful.

### Implementing Proper Access Controls
To implement proper access controls to restrict access to the user table and protect sensitive information, consider the following measures:

1. **Use Role-Based Access Control (RBAC)**: Define roles within your application (such as administrator, regular user, etc.) and establish access controls based on these roles. For example, only administrators may have access to certain sensitive information.

2. **API Access Controls**: If your database is accessed through an API, ensure that your API endpoints are properly secured and that access is restricted based on user roles and permissions.

3. **Data Encryption**: This was already suggested, but I'll emphasize it again. Implement data encryption for sensitive information at rest, using strong encryption methods to protect the data.

4. **Database User Privileges**: Ensure that the database user accounts used by your application have the minimum necessary privileges. Grant access only to the specific tables or operations required by your application, and avoid using superuser or admin privileges unless absolutely necessary.

5. **Audit Access Logs**: Implement logging and auditing mechanisms to track access to sensitive data. This can help identify any unauthorized access or suspicious activities.

By applying these access controls and security measures, you can protect sensitive information within the database and ensure that access is properly restricted based on user roles and permissions.