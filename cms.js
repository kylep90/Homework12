var mysql = require ("mysql");
var inquierer = require("inquirer");
const { connect } = require("http2");
var connection = mysql.createConnection({

    host: "localhost",

    port: 3306,
    user: "root",

    password: "SQLpassword",
    database: "cmsDB"
})

connection.connect(err => {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    initalise()
    // connection.end();
})

function initalise(){
    inquierer.prompt([
        {
            type: "list",
            name: "options",
            message: "What would you like to do?",
            choices: [
                "View all information",
                "View all departments",
                "View all roles",
                "View all employees",
                "Add an employee"
            ]
        }
    ]).then(response =>{
        switch(response.options){
        case("View all departments"):
            viewAll();
            break;
        case("View all departments"):
            viewDepts();
            break;
        case("View all roles"):
            viewRoles();
            break;
        case("View all employees"):
            viewEmployees();
            break;
        case("Add an employee"):
            addEmployee();
            break;           
        default:
            "Could not find your choice"
        }
    })
}
function viewAll(){
    connection.query("select employee.id, first_name, last_name, title, department.name, salary from employee inner join role on employee.id = role.id inner join department on department.id = role.id",
                     (err, data) =>{
        if (err) throw err;
        console.table(data)
        initalise();
        // connection.end
    })
}

function viewDepts(){

    connection.query("SELECT * FROM department", (err, data) =>{
        if (err) throw err;
        console.table(data)
        initalise();
        // connection.end
    })
};

function viewRoles(){

    connection.query("SELECT * FROM role", (err, data) =>{
        if (err) throw err;
        console.table(data)
        initalise();
        connection.end
    })
};

function viewEmployees(){

    connection.query("SELECT * FROM employee", (err, data) =>{
        if (err) throw err;
        console.table(data)
        initalise();
        connection.end
    })
};

//Add an Employee

function addEmployee(){
    inquierer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employees first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employees first name?"
        },
        {
            type: "input",
            name: "employeeDept",
            message: "What department is the employee apart of?"
        },
        {
            type: "input",
            name: "employeeTitle",
            message: "What is the employees title?"
        },
        {
            type: "input",
            name: "employeeSalary",
            message: "What is the employees salary?"
        },

    ]).then(response =>{
        var newEmployee = {
        firstName: response.firstName,
        lastName: response.lastName,
        employeeDept: response.employeeDept,
        employeeTitle: response.employeeTitle,
        employeeSalary: response.employeeSalary
        }
        console.log(newEmployee);
        updateEmployee(newEmployee);
    })
}

function updateEmployee(newEmployee){
    console.log("Updating Employee",newEmployee);
    // console.log("Updating Employee Parse:",parse(newEmployee));
    console.log(newEmployee.employeeDept);
    connection.query(`INSERT INTO department(name) 
                        Values ('${newEmployee.employeeDept}')`, (err, data) =>{
        if (err) throw err;
                        })
        // console.table(data)
        // initalise();
        // connection.end;
    connection.query(`INSERT INTO role(title, salary) 
                        Values ('${newEmployee.employeeTitle}', '${newEmployee.employeeSalary}')`, (err, data) =>{
        if (err) throw err;
                        })
    connection.query(`INSERT INTO employee(first_name, last_name) 
        Values ('${newEmployee.firstName}', '${newEmployee.lastName}')`, (err, data) =>{
        if (err) throw err;
        

})
initalise();
}




