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

        
        var deptArray = [data[0].name];

        console.log("Data", data);
        for(var i = 0; i<data.length; i++){
            
            if (deptArray.indexOf(data[i].name)> -1) {
                console.log(data[i].name, " is already here");
                
            }
            else{
                console.log(data[i].name, "is NOT already here")
                deptArray.push(data[i].name)
            }
            
        }

        console.table(deptArray);

        initalise();
        
    })
};

//Function to view only the ROLES
function viewRoles(){

    connection.query("SELECT * FROM role", (err, data) =>{
        if (err) throw err;

        
        var rolesArray = [data[0].title];

        console.log("Data", data);
        for(var i = 0; i<data.length; i++){
            
            if (rolesArray.indexOf(data[i].title)> -1) {
                console.log(data[i].title, " is already here");
                
            }
            else{
                console.log(data[i].title, "is NOT already here")
                rolesArray.push(data[i].title)
            }
            
        }

        console.table(rolesArray);

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
        // initalise();
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
                }
                initalise();
            }
            
        ); 
        break;

        
        
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
            
                }
                initalise();
            })
            break;

        //Define Finance roles
        case("Finance"):
        connection.query(`INSERT INTO department(name) 
        Values ("Finance")`, (err, data) =>{
            if (err) throw err;
                            });
        inquirer.prompt([
            {
                type: "list",
                name: "financeRoles",
                message: "What Finance role?",
                choices: ["Finance Lead", "Accountant"]
            }
        ]).then(response =>{
            switch(response.financeRoles){
                case("Finance Lead"):
                newEmployee.employeeTitle = response.financeRoles;
                newEmployee.employeeSalary = 145000;
                connection.query(`INSERT INTO role(title, salary) 
                Values ("Finance Lead", "145000")`, (err, data) =>{
                    if (err) throw err;
                                    });
                break;
                
                case("Accountant"):
                employeeTitle= response.financeRoles;
                employeeSalary = 125000;
                connection.query(`INSERT INTO role(title, salary) 
                Values ("Accountant", "125000")`, (err, data) =>{
                    if (err) throw err;
                                    });
                break;
            
                }
                initalise();
            })
            break;

        //Define Legal roles
        case("Legal"):
        connection.query(`INSERT INTO department(name) 
        Values ("Legal")`, (err, data) =>{
            if (err) throw err;
                            });
        inquirer.prompt([
            {
                type: "list",
                name: "legalRoles",
                message: "What Legal role?",
                choices: ["Legal Team Lead", "Lawyer"]
            }
        ]).then(response =>{
            switch(response.legalRoles){
                case("Legal Team Lead"):
                newEmployee.employeeTitle = response.legalRoles;
                newEmployee.employeeSalary = 250000;
                connection.query(`INSERT INTO role(title, salary) 
                Values ("Legal Team Lead", "250000")`, (err, data) =>{
                    if (err) throw err;
                                    });
                break;
                
                case("Lawyer"):
                employeeTitle= response.legalRoles;
                employeeSalary = 190000;
                connection.query(`INSERT INTO role(title, salary) 
                Values ("Lawyer", "190000")`, (err, data) =>{
                    if (err) throw err;
                                    });
                break;
            
                }
                initalise();
            })
            break;
            
     }//End of Switch(dept)
} //End of Function
 
//Function to UPDATE a current EMPLOYEE

var array = [];

function updateEmployee(array){

var chosenName;
    
    getEmployee(array)
    //Function to get the list of names
    function getEmployee(){
        var employeeNames = connection.query(`SELECT employee.id, first_name, last_name FROM employee`, (err, data) =>{
            if (err) throw err;
            for(i=0; i < data.length; i++){
                var fullname = `${data[i].id}, ${data[i].first_name} ${data[i].last_name}`
                array.push(fullname)
            }
            inquirer.prompt([           
        {
            type:"list",
            name:"employeeUpdateName",
            message: "Which employee would you like to update?",
            choices: array   
        },
        {
            type:"list",
            name:"employeeUpdateDept",
            message: "What department would you now like to select?",
            choices:  ["Engineering",
                    "Sales",
                    "Finance",
                    "Legal"]
        },
        {
            type:"list",
            name:"employeeUpdateRole",
            message: "What role would you now like to assign?",
            choices:  ["Lead Engineer",
                        "Software Engineer",
                        "Sales Lead",
                        "Salesperson",
                        "Legal Team Lead",
                        "Lawyer",
                        "Finance Lead",
                        "Accountant"]
        },
    ]).then(response =>{

        //Updates the employees department
        console.log(`${response.employeeUpdateDept}, ${response.employeeUpdateName}`)
        // connection.query(`UPDATE department SET name = ${response.employeeUpdateChoice} where `)

        // console.log("Print name",response.employeeUpdateChoice)
        setSafeModeOff();
        chosenName = response.employeeUpdateName
        inquirer.prompt([

        ])


        // return chosenName;
        // console.log("Passed through function?", chosenName)
    })
    
        });
        // console.log(employeeNames);
    

    
}

}




function setSafeModeOff(){
    connection.query(`set SQL_SAFE_UPDATES = 0;`, (err, data) =>{
        if (err) throw err;
        // connection.end
    })
}
