drop schema IF EXISTS Pharma;
CREATE SCHEMA IF NOT EXISTS Pharma;
USE Pharma;

CREATE TABLE Offices (
	office_code int NOT NULL,
    phone_number varchar(20) NOT NULL,
    address_line1 varchar(20) NOT NULL,
    address_line2 varchar(20),
    city varchar(20) NOT NULL,
    county varchar(20) NOT NULL,
    post_code varchar(9) NOT NULL,
    country varchar(40) NOT NULL,
    territory varchar(20),
    PRIMARY KEY (office_code)
    );

CREATE TABLE Employees (
	employee_no int NOT NULL,
    office_code int NOT NULL,
    reports_to int NOT NULL,
    first_name varchar(20) NOT NULL,
    last_name varchar(20) NOT NULL,
    extension int,
    email varchar(50),
    job_title varchar(30),
    PRIMARY KEY (employee_no),
    FOREIGN KEY (office_code) REFERENCES Offices(office_code),
    FOREIGN KEY (reports_to) REFERENCES Employees(employee_no)
    );
    
CREATE TABLE Customers (
	customer_no int NOT NULL,
    employee_rep int NOT NULL,
	first_name varchar(20) NOT NULL,
    last_name varchar(20) NOT NULL,
	phone_number varchar(20) NOT NULL,
    address_line1 varchar(20) NOT NULL,
    address_line2 varchar(20),
    city varchar(20) NOT NULL,
    county varchar(20),
    post_code varchar(9) NOT NULL,
    country varchar(30) NOT NULL,
    sales_amount float,
    credit_limit float NOT NULL,
    PRIMARY KEY (customer_no),
    FOREIGN KEY (employee_rep) REFERENCES Employees(employee_no)
);

CREATE TABLE Payments (
	customer_no int NOT NULL,
    cheque_no int NOT NULL,
    payment_date date NOT NULL,
    amount_paid float NOT NULL,
    PRIMARY KEY (customer_no, cheque_no),
    FOREIGN KEY (customer_no) REFERENCES Customers(customer_no)
);

CREATE TABLE Product_Lines (
	product_line_text varchar(20) NOT NULL,
    descr varchar(50),
    website varchar(200),
    image BLOB,
    PRIMARY KEY (product_line_text)
);

CREATE TABLE Products (
	product_code int NOT NULL,
    product_line varchar(20) NOT NULL,
    product_name varchar(40) NOT NULL,
    scale_weight float NOT NULL,
    vendor varchar(40) NOT NULL,
    descr varchar(50),
    quantity int NOT NULL,
    buy_price float NOT NULL,
    msrp float NOT NULL,
    PRIMARY KEY (product_code),
    FOREIGN KEY (product_line) REFERENCES Product_Lines(product_line_text) ON UPDATE CASCADE
);

 CREATE TABLE Orders (
	order_no int NOT NULL,
    customer_no int NOT NULL,
    order_date date NOT NULL,
    required_date date NOT NULL,
    ship_date date,
    order_status varchar(30) NOT NULL,
    comments varchar(255),
    PRIMARY KEY (order_no),
    FOREIGN KEY (customer_no) REFERENCES Customers(customer_no)
);

CREATE TABLE Order_Contents (
	order_no int NOT NULL,
    product_code int NOT NULL,
    quantity_ordered int NOT NULL,
    order_line int NOT NULL,
    PRIMARY KEY (order_no, product_code),
    FOREIGN KEY (order_no) REFERENCES Orders(order_no),
    FOREIGN KEY (product_code) REFERENCES Products(product_code)
);

INSERT INTO Offices Values
(638, '+1-801-255-6541', '123 North', 'Main Street', 'Salt Lake City', 'Salt Lake', '84625', 'United States of America', 'US West'),
(1268, '+44-01733-114-333', '456 Broadway', 'Orton South Gate', 'Peterborough', 'Cambridgeshire', 'PE2 6KW', 'United Kingdom', 'UK East Midlands'),
(2041, '+44-0116-2555-311', '1350 London Road', 'Charnwood', 'Leicester', 'Leicestershire', 'LE15 8GD', 'United Kingdom', 'UK North East'),
(8934, '+49-30-453420161', '87', 'Genslerstraße', 'Schmargendorf', 'Berlin', '14195', 'Germany', 'Central Europe');

INSERT INTO Employees VALUES
(154921, 638, 154921, 'NotBill', 'Gates', 152, 'NotBill.Gates@pharma.com', 'CEO'),
(652147, 8934, 154921, 'Hans', 'Gruber', 618, 'Hans.Gruber@pharma.com', 'Managing Director Europe'),
(165468, 1268, 652147, 'George', 'McDuff', 413, 'George.McDuff@pharma.com', 'Sales Manager'),
(568733, 1268, 165468, 'Lucy', 'Diamond', 462, 'Lucy.Diamond@pharma.com', 'Salesman'),
(654984, 2041, 165468, 'Dave', 'Hasslehoff', 462, 'Dave.Hasslehoff@pharma.com', 'Salesman')
;

INSERT INTO Customers Values
(984321, 654984, 'Chris', 'Kingsley', '+1-853-154-6457', '1283 West', 'Prarie Way', 'Boulder', 'Colorado', '12938', 'United States of America', 795.23, 1500),
(165705, 568733, 'Dolph', 'Sieghard', '+49-30-231679841', '70', 'Hallesches Ufer', 'Wendlingen', 'Baden-Württemberg', '73240', 'Germany', 200.35, 500),
(231658, 568733, 'Gwendolyn', 'Tobias', '+4478-2350-8135', '30 Broomfield Place', NULL, 'Stonebridge', NULL, 'TN22 8QQ', 'United Kingdom', 5640, 10000),
(654654, 654984, 'Hannah', 'Andrews', '+44 079 6675 4787', '67 Prospect Hill', NULL, 'Downley', 'High Wycombe', 'HP13 2UB', 'United Kingdom', 1500.50, 2000)
;


INSERT INTO Payments Values
(984321, 123456, '2021-08-24', 795.23),
(231658, 456789, '2020-04-02', 2750),
(165705, 789123, '2019-05-30', 750.25),
(231658, 654321, '2020-06-01', 2890)
;

INSERT INTO Product_Lines VALUES
('Vitamins', 'Products classed as Vitamins', 'www.pharma.com/vitam_package', 'vitamins_promo.jpg'),
('Cold and Flu', 'Cold and Flu Remedies', 'www.pharma.com/fluseason', 'cough.jpg'),
('First Aid', 'First Aid Essentials', 'www.pharma.com/first_aid', 'bandage.jpg'),
('Infant', 'Infant medications', 'www.pharma.com/infant_wellbeing', 'baby.jpg')
;

INSERT INTO Products VALUES
(25, 'First Aid', 'Wonder Bandage', 25.5, 'Wonder, inc', 'All Purpose Bandage', 2000, 2.75, 2.50),
(541, 'Vitamins', 'Healthy Gummy Vitamins', 250, 'Health suppliments dist.', 'A Bottle of all in one gummy vitamins.', 1250, 8.25, 9.00),
(32, 'Vitamins', 'Immune System Boost', 100, 'Good Living', 'A bottle of vitamin c and zinc', 500, 3.00, 3.00),
(294, 'Cold and Flu', 'Clear Nose', 50, 'Sniffles and Fevers ltd.', 'Nasal Decongestant Spray', 750, 5.00, 4.95)
;

INSERT INTO Orders Values
(0354968, 984321, '2021-07-31', '2021-08-20', '2021-08-15', 'Delivered', NULL),
(2456680, 165705, '2021-10-25', '2021-11-10', NULL, 'Processing Order', 'Payment due 12-10-2021'),
(9864135, 231658, '2020-12-29', '2021-01-15', '2021-01-10', 'Delivered', 'Delivered on 2nd attempt'),
(1654765, 654654, '2021-10-26', '2021-10-29', '2021-10-27', 'Shipped', 'Expedited order.'),
(20104, 654654, '2008-5-25', '2008-06-10', '2008-06-07', 'Delivered', 'First Order'),
(20002, 984321, '2007-03-10', '2007-05-01', '2007-04-25', 'Could Not Deliver', 'Customer address was wrong'),
(19882, 165705, '2006-12-01', '2006-12-20', '2006-12-10', 'Delivered', 'Christmas Restock'),
(10085, 231658, '2005-08-25', '2005-09-10', '2005-09-05', 'Returned By Customer', 'Customer Rejected Delivery')
;

INSERT INTO Order_Contents Values
(0354968, 541, 200, 1),
(0354968, 32, 200, 2),
(1654765, 32, 75, 1),
(1654765, 294, 100,2),
(2456680, 25, 500,1),
(20104, 25, 2000,1),
(20104, 294, 150, 2),
(20002, 541, 200,1),
(19882, 541, 100, 1),
(19882, 32, 50,2),
(19882, 25, 150,3),
(10085,32,25,1),
(10085,541,50,2);

CREATE VIEW Customer_Order_Restricted_Info AS SELECT 
		c.customer_no AS Customer_ID, 
		concat(c.first_name, ' ', c.last_name) AS Customer_Name,
        concat_ws("", c.address_line1, ' ', c.address_line2, ', ', c.post_code, ', ', c.country) AS Address,
        o.order_no,
        p.product_name,
        o.order_status,
        oc.quantity_ordered
        FROM Customers AS c
        NATURAL JOIN Orders o 
        NATURAL JOIN Order_Contents oc
        NATURAL JOIN Products p
        
        WHERE c.credit_limit >=1000 AND o.ship_date < '2010-01-01'
        ;
        
select * From Customer_Order_Restricted_Info;

