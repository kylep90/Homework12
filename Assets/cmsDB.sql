DROP DATABASE IF EXISTS cmsDB;

CREATE DATABASE cmsDB;

USE cmsDB;

CREATE TABLE department (
  id INT AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
  );
  
CREATE TABLE role(
id INT auto_increment,
title VARCHAR(30),
salary DECIMAL,
department_id INT,  #to hold reference to department role belongs to
  PRIMARY KEY (id)
);
CREATE TABLE employee(
  id INT auto_increment KEY,
  first_name VARCHAR(30), #to hold employee first name
  last_name VARCHAR(30), #to hold employee last name
  role_id INT, #to hold reference to role employee has
  manager_id INT #to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager
);

INSERT INTO department(name)
Values ("Engineering");

INSERT INTO role (title, salary /*department_id*/)
VALUES ("Lead Engineer", "50000");

INSERT INTO employee (first_name, last_name /*role_id*/ /*manager_id*/)
VALUES ("Kyle", "Pingue");

-- SELECT employee.id, first_name, last_name, title, salary FROM employee
-- INNER JOIN role ON employee.id = role.id

select employee.id, first_name, last_name, title, department.name, salary
from employee 
inner join role on employee.id = role.id
inner join department on department.id = role.id



