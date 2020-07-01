var mysql = require ("mysql");
var inquirer = require("inquirer");
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

//Function to ask user options
function initalise(){
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "What would you like to do?",
            choices: [
                "View all information",
                "View all departments",
                "View all roles",
                "View all employees",
                "Add an employee",
                "Update an employee's details"
            ]
        }
    ]).then(response =>{
        switch(response.options){
        case("View all information"):
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
        case("Update an employee's details"):
            updateEmployee(array);
            break;  
            
        default:
            "Could not find your choice"
        }
    })
}

//Function to view all the data using JOIN
function viewAll(){
    connection.query("select employee.id, first_name, last_name, title, department.name, salary from employee inner join role on employee.id = role.id inner join department on department.id = role.id",
                     (err, data) =>{
        if (err) throw err;
        console.table(data)
        initalise();
        connection.end
    })
}

//Function to view only the DEPARTMENTS
function viewDepts(){

    connection.query("SELECT * FROM department", (err, data) =>{
        if (err) throw err;
        console.table(data)
        initalise();
        // connection.end
    })
};

//Function to view only the ROLES
function viewRoles(){

    connection.query("SELECT * FROM role", (err, data) =>{
        if (err) throw err;
        console.table(data)
        initalise();
        connection.end
    })
};

//Function to view only the EMPLOYEES
function viewEmployees(){

    connection.query("SELECT * FROM employee", (err, data) =>{
        if (err) throw err;
        console.table(data)
        initalise();
        connection.end
    })
};

//Function to ADD an EMPLOYEE

function addEmployee(){
    inquirer.prompt([
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
        renderEmployee(newEmployee);
    })
}

//Function to RENDER the new EMPLOYEE
function renderEmployee(newEmployee){
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

//Function to UPDATE a current EMPLOYEE
var array = ["Mark", "John", "Peter", "Paul"]

function updateEmployee(array){

var chosenName;
    console.log("Array is", array)     //To see if the array passed
    getEmployee(array)
    //Function to get the list of names
    function getEmployee(){
        var employeeNames = connection.query(`SELECT first_name, last_name, employee.id  FROM employee`, (err, data) =>{
            if (err) throw err;
            console.log(data);
            inquirer.prompt([           //To see if the array passed
        {
            type:"list",
            name:"employeeUpdateChoice",
            message: "Which employee would you like to update?",
            choices: []     
        }
    ]).then(response =>{
        console.log("Print name",response.employeeUpdateChoice)
        setSafeModeOff();
        chosenName = response.employeeUpdateChoice
        // return chosenName;
        console.log("Passed through function?", chosenName)
    })
    
        });
        console.log(employeeNames);
    

    
}
//     connection.query(`update employee
//                     SET first_name = "Kyle"
//                     WHERE first_name = ${response.employeeUpdateChoice}`, (err, data) =>{
//                     if (err) throw err;
//                     initalise();
//                     connection.end;
// }

}




function setSafeModeOff(){
    connection.query(`set SQL_SAFE_UPDATES = 0;`, (err, data) =>{
        if (err) throw err;
        // connection.end
    })
}