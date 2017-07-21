DROP DATABASE IF EXISTS inventory_db;
CREATE DATABASE inventory_db;

USE inventory_db;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  category VARCHAR(45) NOT NULL,
  price DECIMAL(10,4) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  PRIMARY KEY (id)
);

SELECT * FROM products;

INSERT INTO products (product_name, category, price, stock_quantity) VALUES ("Shoes","Apparel",65.99,45);
INSERT INTO products (product_name, category, price, stock_quantity) VALUES ("Coffee maker","Appliances",25.99,50);
INSERT INTO products (product_name, category, price, stock_quantity) VALUES ("3-pack t-shirt","Apparel",12.99,100);
INSERT INTO products (product_name, category, price, stock_quantity) VALUES ("I <3 Calculus","Books",89.99,5);
INSERT INTO products (product_name, category, price, stock_quantity) VALUES ("Ant-Man","Movies",23.99,43);
INSERT INTO products (product_name, category, price, stock_quantity) VALUES ("Dr. Strange","Movies",23.99,90);
INSERT INTO products (product_name, category, price, stock_quantity) VALUES ("2-lbs ankle weights","Health & Wellness",15.99,100);
INSERT INTO products (product_name, category, price, stock_quantity) VALUES ("4-lbs ankle weights","Health & Wellness",18.99,24);
INSERT INTO products (product_name, category, price, stock_quantity) VALUES ("Python for Dummies","Books",26.95,8);
INSERT INTO products (product_name, category, price, stock_quantity) VALUES ("Ruby for Dummies","Books",26.95,12);