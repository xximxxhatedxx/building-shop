USE building_shop_db;
GO

IF OBJECT_ID('roles', 'U') IS NULL
CREATE TABLE roles (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(50) NOT NULL
);
GO

IF OBJECT_ID('users', 'U') IS NULL
CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(50) NOT NULL,
    email NVARCHAR(50) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    role_id INT NOT NULL DEFAULT 2,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
GO

IF OBJECT_ID('categories', 'U') IS NULL
CREATE TABLE categories (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(255),
    image_url NVARCHAR(255)
);
GO

IF OBJECT_ID('products', 'U') IS NULL
CREATE TABLE products (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    category_id INT NOT NULL,
    image_url NVARCHAR(255),
    stock_count INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    is_deleted BIT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
GO

IF OBJECT_ID('cart', 'U') IS NULL
CREATE TABLE cart (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
GO

IF OBJECT_ID('orders', 'U') IS NULL
CREATE TABLE orders (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    status NVARCHAR(50) DEFAULT 'pending',
    total_price DECIMAL(10, 2) NOT NULL,
    address NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
GO

IF OBJECT_ID('order_items', 'U') IS NULL
CREATE TABLE order_items (
    id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
GO

IF OBJECT_ID('fn_cart_total', 'FN') IS NOT NULL
    DROP FUNCTION fn_cart_total;
GO

CREATE FUNCTION fn_cart_total(@user_id INT)
RETURNS DECIMAL(10, 2)
AS
BEGIN
    DECLARE @total DECIMAL(10, 2);
    SELECT @total = ISNULL(SUM(c.quantity * p.price), 0)
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = @user_id;
    RETURN @total;
END;
GO

IF NOT EXISTS (SELECT 1 FROM roles WHERE id = 1)
    INSERT INTO roles (id, name) VALUES (1, 'Admin');
IF NOT EXISTS (SELECT 1 FROM roles WHERE id = 2)
    INSERT INTO roles (id, name) VALUES (2, 'User');
GO

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_deleted ON products(is_deleted);
CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_cart_product ON cart(product_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_users_email ON users(email);
GO

PRINT 'Database schema created successfully!';
PRINT 'Default roles inserted (1=Admin, 2=User)';
PRINT 'Ready for application connection.';
GO
