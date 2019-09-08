DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(45) NULL,
    department_name VARCHAR(45) NULL,
	price DECIMAL(10,2) NULL,
	stock_quantity INT NULL,
    product_sales DECIMAL(10,2),
	PRIMARY KEY (id)
  );
  
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("toothbrush", "hygiene", 4.50, 50),
       ("headphones", "electronics", 60, 100),
       ("helmet", "sports", 40, 80),
       ("baseball bat", "sports", 50, 3),
       ("bicycle", "sports", 200, 20),
       ("dental floss", "hygiene", 3, 200),
       ("iphone", "electronics", 500, 600),
       ("pants", "clothing", 45, 300),
       ("dress", "clothing", 90, 2),
       ("tv", "electronics", 400, 50);
       


CREATE TABLE departments (
	id INT NOT NULL AUTO_INCREMENT,
    departmentName VARCHAR(45) NULL,
    over_head_costs DECIMAL(10,2) NULL,
    department_sales VARCHAR(45) NULL,
    PRIMARY KEY (id)
);

INSERT INTO departments (departmentName, over_head_costs)
VALUES ("hygiene", 2000),
	   ("electronics", 10000),
       ("sports", 5000),
       ("clothing", 20000);