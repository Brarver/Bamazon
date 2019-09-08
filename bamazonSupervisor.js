var inquirer = require('inquirer')
var mysql = require('mysql')
var Table = require('cli-table')

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "addison73",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    start()
    
  });

////////////////////////////////START ///////////////////////////////////////////////////////////////////////////

function start() {
    inquirer
      .prompt({
        name: "menu",
        type: "list",
        message: "Please select an option below \n --------------------------------------",
        choices: ["VIEW PRODUCT SALES BY DEPARTMENT", "CREATE NEW DEPARTMENT", "EXIT"]
      })
      .then(function(answer) {
        if (answer.menu === "VIEW PRODUCT SALES BY DEPARTMENT") {
          displayTable();
        } else if (answer.menu === "CREATE NEW DEPARTMENT") {
          createNewDepartment();
        } else if (answer.menu === "EXIT") {
            connection.end()
        }
      });
  }

/////////////////////////////DISPLAY TABLE ////////////////////////////////////////////////////////////////////////

function displayTable() {

    connection.query("SELECT * FROM departments", function(err, res) {
        if (err) throw err

        var table = new Table({
            head: ['DEPARTMENT ID', 'DEPARTMENT NAME', 'OVERHEAD COSTS', 'DEPARTMENT SALES', 'TOTAL PROFIT']
          , colWidths: [20, 20, 20, 20, 20]
        });
         
        for (var i = 0; i < res.length; i++) {
          var ds = res[i].department_sales
          if (ds === null) {
            ds = 0
          }
          
            var arr = []
            arr.push(res[i].id)
            arr.push(res[i].departmentName)
            arr.push(res[i].over_head_costs)
            arr.push(ds)
            arr.push(ds - res[i].over_head_costs)
            table.push(arr)
        }
         
        console.log(table.toString());
    
        start()
      })
}

////////////////////////////Create Department /////////////////////////////////////////////////////////////////////

function createNewDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the department you would like to create?"
      },
      {
        name: "overhead",
        type: "input",
        message: "How much is the department overhead?"
      }
    ]).then(function (answer) {
      connection.query(
        "INSERT INTO departments SET ?",
        {
          departmentName: answer.name,
          over_head_costs: answer.overhead
        }, function (err, res) {
          if (err) throw err
          console.log(answer.name + ' was created as a department!')
          start()
        })
    })
}




