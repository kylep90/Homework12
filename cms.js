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
        var diffDept = data[0].name
        var deptArray = [diffDept]
        
        for(var i=0; i<data.length; i++){
            if(diffDept !== data[i].name){
                deptArray.push(data[i].name)
            }    
        }
        for(var i=0; i<deptArray.length; i++){
            console.table(deptArray[i]);
        }
        // console.table(data)
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
            message: "What is the employees last name?"
        },
        {
            type: "list",
            name: "employeeDept",
            message: "What department is the employee apart of?",
            choices: ["Engineering",
                    "Sales",
                    "Finance",
                    "Legal"]
        }
    ]).then(response =>{
        var newEmployee = {
        firstName: response.firstName,
        lastName: response.lastName,
        employeeDept: response.employeeDept,
        }

        setRole(newEmployee, response.employeeDept);
        initalise();
    })
    // initalise();
}

function setRole(newEmployee, dept){

    //Adds full name
    connection.query(`INSERT INTO employee(first_name, last_name) 
    
    Values ('${newEmployee.firstName}', '${newEmployee.lastName}')`, (err, data) =>{
    if (err) throw err;

    })

    //Defines the Role
    switch(dept){

        //Engineering Dept
        case("Engineering"):
        //Set department to Engineering
        connection.query(`INSERT INTO department(name) 
        Values ("Engineering")`, (err, data) =>{
            if (err) throw err;                   
        })
        inquirer.prompt([
            {
                type: "list",
                name: "engineeringRoles",
                message: "What Engineering role?",
                choices: ["Lead Engineer", "Software Engineer"]
            }
        ]).then(response =>{
            switch(response.engineeringRoles){
                case("Lead Engineer"):
                newEmployee.employeeTitle = response.engineeringRoles;
                newEmployee.employeeSalary = 150000;
                connection.query(`INSERT INTO role(title, salary) 
                Values ("Lead Engineer", "150000")`, (err, data) =>{
                    if (err) throw err;
                                    });
                break;

                case("Software Engineer"):
                employeeTitle= response.engineeringRoles;
                employeeSalary = 150000;
                connection.query(`INSERT INTO role(title, salary) 
                Values ("Software Engineer", "120000")`, (err, data) =>{
                    if (err) throw err;
                                    });
                break;
                default:
                break;
                }
                
            }
        ); 
        break;
        return;
        
        
        //Define Sales roles
        case("Sales"):
        connection.query(`INSERT INTO department(name) 
        Values ("Sales")`, (err, data) =>{
            if (err) throw err;
                            });
        inquirer.prompt([
            {
                type: "list",
                name: "salesRoles",
                message: "What Sales role?",
                choices: ["Sales Lead", "Salesperson"]
            }
        ]).then(response =>{
            switch(response.salesRoles){
                case("Sales Lead"):
                newEmployee.employeeTitle = response.salesRoles;
                newEmployee.employeeSalary = 100000;
                connection.query(`INSERT INTO role(title, salary) 
                Values ("Sales Lead", "100000")`, (err, data) =>{
                    if (err) throw err;
                                    });
                break;
                
                case("Salesperson"):
                employeeTitle= response.salesRoles;
                employeeSalary = 80000;
                connection.query(`INSERT INTO role(title, salary) 
                Values ("Salesperson", "80000")`, (err, data) =>{
                    if (err) throw err;
                                    });
                break;
                default:
                    break;
                }
        
            })
         break;

         default:
         break;
         return;
     }


}
 
//Function to UPDATE a current EMPLOYEE
// var array = ["Mark", "John", "Peter", "Paul"]
var array = [];

function updateEmployee(array){

var chosenName;
    // console.log("Array is", array)     //To see if the array passed
    getEmployee(array)
    //Function to get the list of names
    function getEmployee(){
        var employeeNames = connection.query(`SELECT employee.id, first_name, last_name FROM employee`, (err, data) =>{
            if (err) throw err;
            for(i=0; i < data.length; i++){
                var fullname = `${data[i].first_name} ${data[i].last_name}`
                array.push(fullname)
            }
            // console.log("Data", data);
            // console.log("Data Length", data.length);
            // console.log("Full Names", array)
            inquirer.prompt([           //To see if the array passed
        {
            type:"list",
            name:"employeeUpdateChoice",
            message: "Which employee would you like to update?",
            choices: array   
        },
        {
            type:"list",
            name:"employeeUpdateRole",
            message: "What department would you now like to select?",
            choices:  []
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

}




function setSafeModeOff(){
    connection.query(`set SQL_SAFE_UPDATES = 0;`, (err, data) =>{
        if (err) throw err;
        // connection.end
    })
}
