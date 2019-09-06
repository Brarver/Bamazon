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
        choices: ["VIEW PRODUCT SALES BY DEPARTMENT", "CREATE NEW DEPARTMENT"]
      })
      .then(function(answer) {
        if (answer.menu === "VIEW PRODUCT SALES BY DEPARTMENT") {
          displayTable();
        } else if (answer.menu === "CREATE NEW DEPARTMENT") {
          createNewDepartment();
        } else {
            connnection.end()
        }
      });
  }

/////////////////////////////DISPLAY TABLE ////////////////////////////////////////////////////////////////////////

function displayTable() {
    connection.query("SELECT * FROM departments", function(err, res) {

        console.log(res[0])
    
        var table = new Table({
            head: ['DEPARTMENT ID', 'DEPARTMENT NAME', 'OVERHEAD COSTS', 'PRODUCT SALES', 'TOTAL PROFIT']
          , colWidths: [20, 20, 20, 20, 20]
        });
         
        for (var i = 0; i < res.length; i++) {
            var arr = []
            arr.push(res[i].id)
            arr.push(res[i].department_name)
            arr.push(res[i].over_head_costs)
            table.push(arr)
        }
         
        console.log(table.toString());
    
        connection.end()
        start()
      })
}
  